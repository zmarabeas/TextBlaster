// Twilio client helper functions

// Get your message status based on Twilio status response
export const mapTwilioStatus = (twilioStatus: string): string => {
  switch (twilioStatus.toLowerCase()) {
    case 'sent':
      return 'sent';
    case 'delivered':
      return 'delivered';
    case 'read':
      return 'read';
    case 'failed':
    case 'undelivered':
      return 'failed';
    default:
      return 'sent';
  }
};

// Format phone number for display
export const formatPhoneNumber = (phoneNumber: string): string => {
  // Strip any non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Check if the number has the correct length for US phone numbers
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  // Return the original format if it doesn't match expected patterns
  return phoneNumber;
};

// Validate phone number
export const validatePhoneNumber = (phoneNumber: string): boolean => {
  // Basic US phone number validation
  const phoneRegex = /^\+?1?\s*\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})$/;
  return phoneRegex.test(phoneNumber);
};

// Normalize phone number for sending to Twilio
export const normalizePhoneNumber = (phoneNumber: string): string => {
  // Strip any non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Make sure the number starts with the country code
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  } else if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+${cleaned}`;
  }
  
  // If it already has a plus sign, return as is
  if (phoneNumber.startsWith('+')) {
    return phoneNumber;
  }
  
  // Default case, just add a plus sign
  return `+${cleaned}`;
};

// Replace variables in message templates
export const replaceTemplateVariables = (
  template: string, 
  variables: Record<string, string>
): string => {
  let message = template;
  
  // Replace each variable in the template
  Object.entries(variables).forEach(([key, value]) => {
    message = message.replace(new RegExp(`{${key}}`, 'g'), value);
  });
  
  return message;
};
