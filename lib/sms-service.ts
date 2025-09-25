import AfricasTalking from 'africastalking';

// Initialize Africa's Talking with your credentials
const credentials = {
  apiKey: 'atsk_39b806b4bfd06db95ce7b18698a9fda2ef2fe1630c2dff48859b4d8bd847658ae7a4a5ae',
  username: 'blackie',
};

const africastalking = AfricasTalking(credentials);
const sms = africastalking.SMS;

export interface SMSMessage {
  to: string;
  message: string;
  studentName: string;
  attendanceStatus: 'present' | 'absent' | 'late' | 'excused';
  date: string;
}

export class SMSService {
  /**
   * Send SMS notification to parent about student attendance
   */
  static async sendAttendanceNotification(smsData: SMSMessage): Promise<boolean> {
    try {
      const message = this.formatAttendanceMessage(smsData);
      
      const options = {
        to: [smsData.to],
        message: message,
        // You can add a senderId if you have one registered with Africa's Talking
        // senderId: 'YOUR_SENDER_ID'
      };

      const response = await sms.send(options);
      console.log('SMS sent successfully:', response);
      return true;
    } catch (error) {
      console.error('Failed to send SMS:', error);
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
   * Format the attendance message for SMS
   */
  private static formatAttendanceMessage(smsData: SMSMessage): string {
    const statusEmoji = {
      present: '✅',
      absent: '❌',
      late: '⏰',
      excused: '📝'
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

    const emoji = statusEmoji[smsData.attendanceStatus];
    const status = statusText[smsData.attendanceStatus];
    const message = statusMessage[smsData.attendanceStatus];

    return `${emoji} SCHOOL ATTENDANCE ALERT

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
   */
  static formatPhoneNumber(phoneNumber: string): string {
    let cleaned = phoneNumber.replace(/[\s\-\(\)]/g, '');
    
    // If it doesn't start with +, add it
    if (!cleaned.startsWith('+')) {
      cleaned = '+' + cleaned;
    }
    
    return cleaned;
  }
}
