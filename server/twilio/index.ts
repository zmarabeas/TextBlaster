export * from './client';
export * from './webhooks';

// Re-export the main functionality for convenient imports
export { 
  initTwilioClient, 
  sendSms, 
  sendBatchSms 
} from './client';

export {
  handleMessageStatusUpdate,
  handleIncomingMessage,
  getMessageBatchStatus
} from './webhooks';