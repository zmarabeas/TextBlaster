import { log } from '../vite';
import twilio from 'twilio';

// Check for required environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

let client: twilio.Twilio | null = null;

/**
 * Initialize the Twilio client
 * This should be called at application startup
 */
export function initTwilioClient() {
  if (!accountSid || !authToken) {
    log('Twilio credentials are missing. SMS functionality will be unavailable.', 'twilio');
    return;
  }
  
  try {
    client = twilio(accountSid, authToken);
    log('Twilio client initialized successfully', 'twilio');
  } catch (error) {
    log(`Error initializing Twilio client: ${error}`, 'twilio');
    client = null;
  }
}

/**
 * Check if the Twilio client is initialized and ready to send messages
 */
export function isTwilioReady(): boolean {
  return !!client && (!!twilioPhoneNumber || !!messagingServiceSid);
}

/**
 * Send a single SMS message via Twilio
 * 
 * @param to The phone number to send the message to
 * @param body The message body
 * @param statusCallback URL to receive status updates for this message
 * @returns The Twilio MessageInstance if successful, null otherwise
 */
export async function sendSms(
  to: string,
  body: string,
  statusCallback?: string
): Promise<twilio.MessageInstance | null> {
  if (!client) {
    log('Twilio client is not initialized', 'twilio');
    return null;
  }
  
  if (!to || !body) {
    log('Missing required parameters for sending SMS', 'twilio');
    return null;
  }
  
  try {
    const messageOptions: twilio.MessageListInstanceCreateOptions = {
      to,
      body,
      statusCallback
    };
    
    // Use either messaging service or from number
    if (messagingServiceSid) {
      messageOptions.messagingServiceSid = messagingServiceSid;
    } else if (twilioPhoneNumber) {
      messageOptions.from = twilioPhoneNumber;
    } else {
      log('No Twilio phone number or messaging service SID provided', 'twilio');
      return null;
    }
    
    const message = await client.messages.create(messageOptions);
    log(`SMS sent successfully to ${to}, SID: ${message.sid}`, 'twilio');
    return message;
  } catch (error) {
    log(`Error sending SMS to ${to}: ${error}`, 'twilio');
    return null;
  }
}

/**
 * Send multiple SMS messages via Twilio
 * 
 * @param messages Array of message objects
 * @param statusCallback URL to receive status updates for these messages
 * @returns Array of sent message results
 */
export async function sendBatchSms(
  messages: Array<{ to: string; body: string; messageId?: number }>,
  statusCallback?: string
): Promise<Array<{ 
  success: boolean; 
  to: string; 
  messageSid?: string; 
  messageId?: number;
  error?: string 
}>> {
  if (!client) {
    log('Twilio client is not initialized', 'twilio');
    return messages.map(msg => ({
      success: false,
      to: msg.to,
      messageId: msg.messageId,
      error: 'Twilio client is not initialized'
    }));
  }
  
  const results = [];
  
  for (const message of messages) {
    try {
      const sentMessage = await sendSms(message.to, message.body, statusCallback);
      
      if (sentMessage) {
        results.push({
          success: true,
          to: message.to,
          messageSid: sentMessage.sid,
          messageId: message.messageId
        });
      } else {
        results.push({
          success: false,
          to: message.to,
          messageId: message.messageId,
          error: 'Failed to send message'
        });
      }
    } catch (error) {
      results.push({
        success: false,
        to: message.to,
        messageId: message.messageId,
        error: `Error: ${error}`
      });
    }
  }
  
  return results;
}