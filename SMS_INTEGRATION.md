# SMS Integration with Africa's Talking

This document describes the SMS notification system integrated into the school attendance management system.

## Overview

The system automatically sends SMS notifications to parents for ALL attendance statuses (present, absent, late, excused) when teachers mark student attendance. The integration uses Africa's Talking API for reliable SMS delivery across Africa.

## Features

- **Automatic SMS Notifications**: Parents receive SMS for ALL attendance statuses (present, absent, late, excused)
- **Bulk SMS Support**: Send notifications to multiple parents simultaneously
- **Phone Number Validation**: Validates and formats phone numbers for international delivery
- **Visual Indicators**: Shows which students will receive SMS notifications
- **Test Interface**: Dedicated page for testing SMS functionality

## Configuration

### API Credentials

The system uses the following Africa's Talking credentials:
- **Username**: `blackie`
- **API Key**: `atsk_39b806b4bfd06db95ce7b18698a9fda2ef2fe1630c2dff48859b4d8bd847658ae7a4a5ae`

### Phone Number Format

Phone numbers should be in international format:
- ✅ Correct: `+254712345678`
- ❌ Incorrect: `0712345678`, `254712345678`

## How It Works

### 1. Attendance Marking
Teachers mark student attendance using the attendance table:
- **Present**: SMS sent to parent ✅
- **Absent**: SMS sent to parent ❌
- **Late**: SMS sent to parent ⏰
- **Excused**: SMS sent to parent 📝

### 2. SMS Message Format
```
✅ SCHOOL ATTENDANCE ALERT

Dear Parent/Guardian,

Your child attended school today.

Student: John Doe
Status: PRESENT
Date: 12/20/2024

For any questions, please contact the school office.

Thank you,
School Administration
```

### 3. Delivery Process
1. System detects ALL students with parent phone numbers
2. Validates parent phone numbers
3. Formats SMS messages with appropriate status-specific content
4. Sends via Africa's Talking API
5. Reports success/failure status

## Files Structure

```
lib/
├── sms-service.ts          # Core SMS service with Africa's Talking integration
└── students.ts             # Student data with parent phone numbers

app/
├── api/sms/send/route.ts   # API endpoint for sending SMS
└── test-sms/page.tsx       # Test interface for SMS functionality

components/
├── attendance-table.tsx     # Updated attendance table with SMS integration
└── sidebar-nav.tsx         # Navigation with SMS test page

types/
└── africastalking.d.ts     # TypeScript declarations for Africa's Talking
```

## Usage

### For Teachers

1. Navigate to **Take Attendance** page
2. Mark students as present, absent, late, or excused
3. Click **Submit Attendance**
4. System automatically sends SMS to ALL parents with phone numbers
5. View SMS notification count in the summary section

### For Testing

1. Navigate to **Test SMS** page
2. Enter parent phone number (with country code)
3. Enter student name
4. Select attendance status
5. Click **Send Test SMS**
6. View message preview and delivery result

## API Endpoints

### POST /api/sms/send

Send SMS notifications for attendance.

**Request Body:**
```json
{
  "smsData": {
    "to": "+254712345678",
    "message": "",
    "studentName": "John Doe",
    "attendanceStatus": "absent",
    "date": "12/20/2024"
  }
}
```

**Bulk Request:**
```json
{
  "bulkData": [
    {
      "to": "+254712345678",
      "message": "",
      "studentName": "John Doe",
      "attendanceStatus": "absent",
      "date": "12/20/2024"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "SMS sent successfully",
  "results": {
    "success": 1,
    "failed": 0
  }
}
```

## Error Handling

- **Invalid Phone Numbers**: Validated before sending
- **API Failures**: Graceful error handling with user feedback
- **Network Issues**: Retry mechanism for failed deliveries
- **Rate Limiting**: Batch processing to respect API limits

## Security Considerations

- API credentials are stored in the service file (consider environment variables for production)
- Phone numbers are validated before sending
- SMS content is sanitized and formatted consistently

## Future Enhancements

- [ ] Environment variable configuration for API credentials
- [ ] SMS delivery status tracking
- [ ] Customizable message templates
- [ ] Parent opt-in/opt-out functionality
- [ ] SMS history and analytics
- [ ] Multi-language support

## Troubleshooting

### Common Issues

1. **SMS not delivered**
   - Check phone number format
   - Verify Africa's Talking account balance
   - Check API credentials

2. **Invalid phone number error**
   - Ensure phone number starts with country code
   - Remove spaces, dashes, and parentheses
   - Use international format (+254...)

3. **API errors**
   - Check internet connection
   - Verify API credentials
   - Check Africa's Talking service status

### Support

For technical support or questions about the SMS integration, please contact the development team or refer to the Africa's Talking documentation.
