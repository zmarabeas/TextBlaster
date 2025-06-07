import { Request, Response } from 'express';
import { storage } from '../storage';
import { log } from '../vite';

/**
 * Handles webhook requests from Twilio for message status updates
 * 
 * This endpoint should be set as the Status Callback URL in your Twilio messaging service
 * or when sending individual messages.
 * 
 * Twilio will POST to this endpoint with status updates as messages progress through
 * their lifecycle (queued, sent, delivered, failed, etc.)
 */
export async function handleMessageStatusUpdate(req: Request, res: Response) {
  try {
    const {
      MessageSid,
      MessageStatus,
      ErrorCode,
      ErrorMessage
    } = req.body;

    log(`Received status update for message ${MessageSid}: ${MessageStatus}`, 'twilio');
    
    // Find the message in our database by the Twilio message SID
    const message = await storage.getMessageByTwilioSid(MessageSid);
    
    if (!message) {
      log(`Message with Twilio SID ${MessageSid} not found in database`, 'twilio');
      return res.status(404).send({
        success: false,
        message: "Message not found"
      });
    }
    
    // Update message status in our database
    await storage.updateMessageStatus(message.id, MessageStatus);
    
    // If there was an error, log it and update error details
    if (ErrorCode) {
      log(`Error for message ${MessageSid}: ${ErrorCode} - ${ErrorMessage}`, 'twilio');
      await storage.updateMessageError(message.id, {
        errorCode: ErrorCode,
        errorMessage: ErrorMessage
      });
    }
    
    // Return a 200 OK to Twilio
    return res.status(200).send({
      success: true
    });
  } catch (error) {
    log(`Error processing message status update: ${error}`, 'twilio');
    return res.status(500).send({
      success: false,
      message: "Error processing webhook"
    });
  }
}

/**
 * Handles incoming SMS messages from Twilio
 * 
 * This endpoint should be set as the Inbound Message URL in your Twilio phone number
 * or messaging service configuration.
 * 
 * Twilio will POST to this endpoint when a new message is received.
 */
export async function handleIncomingMessage(req: Request, res: Response) {
  try {
    const {
      From,
      To,
      Body,
      MessageSid
    } = req.body;
    
    log(`Received incoming message from ${From} to ${To}: ${Body}`, 'twilio');
    
    // Find the client by phone number
    const clients = await storage.getClientsByPhoneNumber(From);
    
    if (clients.length === 0) {
      log(`No client found with phone number ${From}`, 'twilio');
      // In a production app, you might want to create a new client here
      return res.status(200).send();
    }
    
    // Use the first matching client
    const client = clients[0];
    
    // Create a new message in our database
    const messageData = {
      clientId: client.id,
      userId: client.userId,
      content: Body,
      direction: 'inbound',
      status: 'received'
    };
    
    // Create the message
    const message = await storage.createMessage(messageData);
    
    // Update with Twilio SID
    if (message && MessageSid) {
      await storage.updateMessageStatus(message.id, 'received');
    }
    
    // Return a 200 OK to Twilio
    return res.status(200).send();
    
  } catch (error) {
    log(`Error processing incoming message: ${error}`, 'twilio');
    return res.status(500).send({
      success: false,
      message: "Error processing webhook"
    });
  }
}

/**
 * Get a progress report on a batch of messages
 * This can be used for reporting on mass message campaigns
 */
export async function getMessageBatchStatus(req: Request, res: Response) {
  try {
    const { batchId } = req.params;
    
    if (!batchId) {
      return res.status(400).send({
        success: false,
        message: "Batch ID is required"
      });
    }
    
    // Get all messages in this batch
    const messages = await storage.getMessagesByBatchId(batchId);
    
    if (messages.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No messages found for this batch"
      });
    }
    
    // Count messages by status
    const statusCounts = messages.reduce((counts, message) => {
      const status = message.status || 'unknown';
      counts[status] = (counts[status] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
    
    // Calculate progress percentage
    const totalMessages = messages.length;
    const deliveredMessages = statusCounts['delivered'] || 0;
    const failedMessages = statusCounts['failed'] || 0;
    const undeliveredMessages = statusCounts['undelivered'] || 0;
    
    const progress = {
      total: totalMessages,
      delivered: deliveredMessages,
      failed: failedMessages + undeliveredMessages,
      queued: statusCounts['queued'] || 0,
      sent: statusCounts['sent'] || 0,
      deliveredPercentage: Math.round((deliveredMessages / totalMessages) * 100),
      failedPercentage: Math.round(((failedMessages + undeliveredMessages) / totalMessages) * 100),
      inProgressPercentage: Math.round(((statusCounts['queued'] || 0) + (statusCounts['sent'] || 0)) / totalMessages * 100),
      isComplete: (deliveredMessages + failedMessages + undeliveredMessages) === totalMessages,
      statusCounts
    };
    
    return res.status(200).send({
      success: true,
      progress
    });
    
  } catch (error) {
    log(`Error getting batch status: ${error}`, 'twilio');
    return res.status(500).send({
      success: false,
      message: "Error getting batch status"
    });
  }
}