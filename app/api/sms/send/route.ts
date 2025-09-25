import { NextRequest, NextResponse } from 'next/server';
import { SMSService, SMSMessage, CustomSMSMessage } from '@/lib/sms-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { smsData, bulkData, customSmsData } = body;

    if (customSmsData) {
      // Handle custom SMS sending
      const success = await SMSService.sendCustomMessage(customSmsData);
      
      if (success) {
        return NextResponse.json({
          success: true,
          message: 'Custom SMS sent successfully'
        });
      } else {
        return NextResponse.json({
          success: false,
          message: 'Failed to send custom SMS. Please check your Africa\'s Talking account balance and try again.'
        }, { status: 500 });
      }
    } else if (bulkData && Array.isArray(bulkData)) {
      // Handle bulk SMS sending
      const results = await SMSService.sendBulkAttendanceNotifications(bulkData);
      
      return NextResponse.json({
        success: true,
        message: `Bulk SMS sent: ${results.success} successful, ${results.failed} failed`,
        results
      });
    } else if (smsData) {
      // Handle single SMS sending
      const success = await SMSService.sendAttendanceNotification(smsData);
      
      if (success) {
        return NextResponse.json({
          success: true,
          message: 'SMS sent successfully'
        });
      } else {
        return NextResponse.json({
          success: false,
          message: 'Failed to send SMS. Please check your Africa\'s Talking account balance and try again.'
        }, { status: 500 });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: 'Invalid request data'
      }, { status: 400 });
    }
  } catch (error) {
    console.error('SMS API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}
