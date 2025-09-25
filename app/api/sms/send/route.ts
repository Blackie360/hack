import { NextRequest, NextResponse } from 'next/server';
import { SMSService, SMSMessage } from '@/lib/sms-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { smsData, bulkData } = body;

    if (bulkData && Array.isArray(bulkData)) {
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
          message: 'Failed to send SMS'
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
