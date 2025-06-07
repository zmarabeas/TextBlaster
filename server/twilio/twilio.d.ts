import * as twilio from 'twilio';

declare module 'twilio' {
  interface MessageInstance {
    sid: string;
    status: string;
    dateCreated: Date;
    dateUpdated: Date;
    dateSent: Date | null;
    direction: string;
    from: string;
    to: string;
    body: string;
    errorCode: string | null;
    errorMessage: string | null;
  }

  interface MessageListInstanceCreateOptions {
    to: string;
    body: string;
    from?: string;
    messagingServiceSid?: string;
    statusCallback?: string;
    applicationSid?: string;
    maxPrice?: number;
    validityPeriod?: number;
    forceDelivery?: boolean;
    contentRetention?: string;
    addressRetention?: string;
    smartEncoded?: boolean;
    persistentAction?: Array<string>;
    scheduleType?: string;
    sendAt?: Date;
    attempt?: number;
    validityPeriod?: number;
    contentSid?: string;
    contentVariables?: string;
  }
}