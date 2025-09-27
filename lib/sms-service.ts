import AfricasTalking from 'africastalking';

// Initialize Africa's Talking with your credentials
const credentials = {
  apiKey: process.env.AFRICASTALKING_API_KEY || 'atsk_e0b64ba1cf5620b28477cb5893e635a331c589a2b6fe5b89ad6c6c08cc7832f99fc771d7',
  username: process.env.AFRICASTALKING_USERNAME || 'Chegeh',
};

// Debug: Log credentials being used (without exposing the full API key)
console.log('SMS Service initialized with username:', credentials.username);
console.log('API Key (first 10 chars):', credentials.apiKey.substring(0, 10) + '...');

const africastalking = AfricasTalking(credentials);
const sms = africastalking.SMS;

export interface SMSMessage {
  to: string;
  message: string;
  studentName: string;
  attendanceStatus: 'present' | 'absent' | 'late' | 'excused';
  date: string;
}

export interface CustomSMSMessage {
  to: string;
  message: string;
  studentName: string;
  parentName: string;
  teacherName: string;
  messageType: 'general' | 'attendance' | 'behavior' | 'academic' | 'event' | 'emergency';
}

export class SMSService {
  /**
   * Send SMS notification to parent about student attendance
   */
  static async sendAttendanceNotification(smsData: SMSMessage): Promise<boolean> {
    try {
      // Validate phone number format
      if (!this.validatePhoneNumber(smsData.to)) {
        console.error('Invalid phone number format:', smsData.to);
        return false;
      }

      // Check if it's an African phone number
      if (!this.isAfricanPhoneNumber(smsData.to)) {
        console.warn('Phone number may not be supported by Africa\'s Talking:', smsData.to);
        console.warn('Africa\'s Talking primarily supports African countries');
      }

      const message = this.formatAttendanceMessage(smsData);
      
      const options = {
        to: [smsData.to],
        message: message,
        // You can add a senderId if you have one registered with Africa's Talking
        // senderId: 'YOUR_SENDER_ID'
      };

      console.log('Sending SMS to:', smsData.to);
      console.log('Message:', message);
      
      const response = await sms.send(options);
      console.log('SMS API Response:', response);
      
      // Check if SMS was actually delivered
      if (response && response.SMSMessageData) {
        const messageData = response.SMSMessageData;
        console.log('SMS Message Data:', messageData);
        
        // Check if any messages were sent
        if (messageData.Recipients && messageData.Recipients.length > 0) {
          const recipient = messageData.Recipients[0];
          console.log('Recipient Status:', recipient);
          
          if (recipient.status === 'Success') {
            console.log('SMS delivered successfully');
            return true;
          } else {
            console.error('SMS delivery failed:', recipient.status, recipient.statusCode);
            
            // Handle specific error cases
            if (recipient.status === 'InsufficientBalance') {
              console.error('ERROR: Insufficient balance in Africa\'s Talking account. Please top up your account.');
            } else if (recipient.statusCode === 405) {
              console.error('ERROR: Account billing issue. Please check your Africa\'s Talking account balance.');
            }
            
            return false;
          }
        }
      }
      
      return true; // Assume success if we can't determine status
    } catch (error) {
      console.error('Failed to send SMS:', error);
      return false;
    }
  }

  /**
   * Send custom SMS message to parent about specific student
   */
  static async sendCustomMessage(smsData: CustomSMSMessage): Promise<boolean> {
    try {
      // Validate phone number format
      if (!this.validatePhoneNumber(smsData.to)) {
        console.error('Invalid phone number format:', smsData.to);
        return false;
      }

      // Check if it's an African phone number
      if (!this.isAfricanPhoneNumber(smsData.to)) {
        console.warn('Phone number may not be supported by Africa\'s Talking:', smsData.to);
        console.warn('Africa\'s Talking primarily supports African countries');
      }

      const message = this.formatCustomMessage(smsData);
      
      const options = {
        to: [smsData.to],
        message: message,
        // You can add a senderId if you have one registered with Africa's Talking
        // senderId: 'YOUR_SENDER_ID'
      };

      console.log('Sending custom SMS to:', smsData.to);
      console.log('Message:', message);
      
      const response = await sms.send(options);
      console.log('Custom SMS API Response:', response);
      
      // Check if SMS was actually delivered
      if (response && response.SMSMessageData) {
        const messageData = response.SMSMessageData;
        console.log('SMS Message Data:', messageData);
        
        // Check if any messages were sent
        if (messageData.Recipients && messageData.Recipients.length > 0) {
          const recipient = messageData.Recipients[0];
          console.log('Recipient Status:', recipient);
          
          if (recipient.status === 'Success') {
            console.log('Custom SMS delivered successfully');
            return true;
          } else {
            console.error('Custom SMS delivery failed:', recipient.status, recipient.statusCode);
            
            // Handle specific error cases
            if (recipient.status === 'InsufficientBalance') {
              console.error('ERROR: Insufficient balance in Africa\'s Talking account. Please top up your account.');
            } else if (recipient.statusCode === 405) {
              console.error('ERROR: Account billing issue. Please check your Africa\'s Talking account balance.');
            }
            
            return false;
          }
        }
      }
      
      return true; // Assume success if we can't determine status
    } catch (error) {
      console.error('Failed to send custom SMS:', error);
      return false;
    }
  }

  /**
   * Send bulk SMS notifications for multiple students
   */
  static async sendBulkAttendanceNotifications(smsDataArray: SMSMessage[]): Promise<{ success: number; failed: number }> {
    let successCount = 0;
    let failedCount = 0;

    // Process SMS messages in batches to avoid rate limiting
    const batchSize = 5;
    for (let i = 0; i < smsDataArray.length; i += batchSize) {
      const batch = smsDataArray.slice(i, i + batchSize);
      
      const promises = batch.map(async (smsData) => {
        const success = await this.sendAttendanceNotification(smsData);
        if (success) {
          successCount++;
        } else {
          failedCount++;
        }
        return success;
      });

      await Promise.all(promises);
      
      // Add a small delay between batches to respect rate limits
      if (i + batchSize < smsDataArray.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return { success: successCount, failed: failedCount };
  }

  /**
   * Format custom message for SMS
   */
  private static formatCustomMessage(smsData: CustomSMSMessage): string {
    const messageTypePrefixes = {
      general: '[SCHOOL]',
      attendance: '[ATTENDANCE]',
      behavior: '[BEHAVIOR]',
      academic: '[ACADEMIC]',
      event: '[EVENT]',
      emergency: '[URGENT]'
    };

    const messageTypeTitles = {
      general: 'SCHOOL MESSAGE',
      attendance: 'ATTENDANCE UPDATE',
      behavior: 'BEHAVIOR NOTICE',
      academic: 'ACADEMIC UPDATE',
      event: 'EVENT NOTIFICATION',
      emergency: 'EMERGENCY ALERT'
    };

    const prefix = messageTypePrefixes[smsData.messageType];
    const title = messageTypeTitles[smsData.messageType];

    return `${prefix} ${title}

Dear ${smsData.parentName},

${smsData.message}

Student: ${smsData.studentName}
From: ${smsData.teacherName}

For any questions, please contact the school office.

Thank you,
School Administration`;
  }

  /**
   * Format the attendance message for SMS
   */
  private static formatAttendanceMessage(smsData: SMSMessage): string {
    const statusPrefix = {
      present: '[PRESENT]',
      absent: '[ABSENT]',
      late: '[LATE]',
      excused: '[EXCUSED]'
    };

    const statusText = {
      present: 'PRESENT',
      absent: 'ABSENT',
      late: 'LATE',
      excused: 'EXCUSED'
    };

    const statusMessage = {
      present: 'Your child attended school today.',
      absent: 'Your child was absent from school today. Please contact the school if this was unexpected.',
      late: 'Your child arrived late to school today.',
      excused: 'Your child was excused from school today.'
    };

    const prefix = statusPrefix[smsData.attendanceStatus];
    const status = statusText[smsData.attendanceStatus];
    const message = statusMessage[smsData.attendanceStatus];

    return `${prefix} SCHOOL ATTENDANCE ALERT

Dear Parent/Guardian,

${message}

Student: ${smsData.studentName}
Status: ${status}
Date: ${smsData.date}

For any questions, please contact the school office.

Thank you,
School Administration`;

  }

  /**
   * Validate phone number format (basic validation)
   */
  static validatePhoneNumber(phoneNumber: string): boolean {
    // Remove any spaces, dashes, or parentheses
    const cleaned = phoneNumber.replace(/[\s\-\(\)]/g, '');
    
    // Check if it starts with + and has at least 10 digits
    const phoneRegex = /^\+[1-9]\d{9,14}$/;
    return phoneRegex.test(cleaned);
  }

  /**
   * Format phone number for Africa's Talking (ensure it starts with +)
   * Handles common African phone number formats
   */
  static formatPhoneNumber(phoneNumber: string): string {
    let cleaned = phoneNumber.replace(/[\s\-\(\)]/g, '');
    
    // If it doesn't start with +, add it
    if (!cleaned.startsWith('+')) {
      cleaned = '+' + cleaned;
    }
    
    // Handle common African phone number formats
    // Kenya: +254XXXXXXXXX
    // Uganda: +256XXXXXXXXX
    // Tanzania: +255XXXXXXXXX
    // Nigeria: +234XXXXXXXXX
    // South Africa: +27XXXXXXXXX
    
    return cleaned;
  }

  /**
   * Check if phone number is from a supported African country
   */
  static isAfricanPhoneNumber(phoneNumber: string): boolean {
    const cleaned = phoneNumber.replace(/[\s\-\(\)]/g, '');
    const africanCountryCodes = [
      '+254', // Kenya
      '+256', // Uganda
      '+255', // Tanzania
      '+234', // Nigeria
      '+27',  // South Africa
      '+233', // Ghana
      '+220', // Gambia
      '+225', // Ivory Coast
      '+226', // Burkina Faso
      '+227', // Niger
      '+228', // Togo
      '+229', // Benin
      '+230', // Mauritius
      '+231', // Liberia
      '+232', // Sierra Leone
      '+235', // Chad
      '+236', // Central African Republic
      '+237', // Cameroon
      '+238', // Cape Verde
      '+239', // São Tomé and Príncipe
      '+240', // Equatorial Guinea
      '+241', // Gabon
      '+242', // Republic of the Congo
      '+243', // Democratic Republic of the Congo
      '+244', // Angola
      '+245', // Guinea-Bissau
      '+246', // British Indian Ocean Territory
      '+247', // Ascension Island
      '+248', // Seychelles
      '+249', // Sudan
      '+250', // Rwanda
      '+251', // Ethiopia
      '+252', // Somalia
      '+253', // Djibouti
      '+254', // Kenya
      '+255', // Tanzania
      '+256', // Uganda
      '+257', // Burundi
      '+258', // Mozambique
      '+260', // Zambia
      '+261', // Madagascar
      '+262', // Réunion
      '+263', // Zimbabwe
      '+264', // Namibia
      '+265', // Malawi
      '+266', // Lesotho
      '+267', // Botswana
      '+268', // Eswatini
      '+269', // Comoros
      '+290', // Saint Helena
      '+291', // Eritrea
      '+297', // Aruba
      '+298', // Faroe Islands
      '+299', // Greenland
    ];
    
    return africanCountryCodes.some(code => cleaned.startsWith(code));
  }
}
