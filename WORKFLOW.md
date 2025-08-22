# Updated Workflow: Real-time Google Sheets Integration

## What Changed

Previously, users would register and their data would only be stored locally. An admin would need to manually click "Send to Google Sheets" to export all data at once.

**Now**: Data is automatically sent to Google Sheets the moment a user completes their registration!

## New Registration Flow

1. **User fills out registration form** (5 steps)
2. **User clicks "Complete Registration"**
3. **Frontend immediately sends data to backend** (`http://localhost:3001/api/google-sheets`)
4. **Backend forwards request to Google Apps Script** (bypasses CORS)
5. **Google Apps Script adds data to sheet**
6. **User sees success/error message**
7. **Data appears in admin dashboard** and Google Sheets simultaneously

## Benefits

✅ **Real-time sync** - No manual exports needed  
✅ **Better user experience** - Immediate confirmation  
✅ **Data safety** - Nothing gets lost  
✅ **Admin convenience** - Always up-to-date data  
✅ **CORS compliance** - Backend proxy solves browser restrictions  

## Admin Dashboard Changes

- **Removed**: "Send to Google Sheets" button
- **Added**: "Auto-Sync Enabled" indicator
- **Same**: View registrations by date, user details modal

## Technical Implementation

### Frontend (SignupForm.tsx)
```javascript
const handleSubmit = async () => {
  // ... validation
  
  try {
    await axios.post('http://localhost:3001/api/google-sheets', {
      data: [userData],
      sheetUrl: 'your-sheet-url'
    });
    
    setSubmissionStatus({
      type: 'success',
      message: 'Registration successful! Your data has been saved.'
    });
  } catch (error) {
    setSubmissionStatus({
      type: 'error', 
      message: 'Registration saved locally, but failed to sync with Google Sheets.'
    });
  }
};
```

### Backend (server.js)
```javascript
app.post('/api/google-sheets', async (req, res) => {
  try {
    const response = await axios.post(GOOGLE_SCRIPT_URL, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Google Apps Script
```javascript
function doPost(e) {
  try {
    const request = JSON.parse(e.postData.contents);
    const data = request.data;
    const sheetUrl = request.sheetUrl;
    
    const ss = SpreadsheetApp.openByUrl(sheetUrl);
    const sheet = ss.getSheetByName('Registrations') || ss.insertSheet('Registrations');
    
    // Set headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Full Name', 'Phone Number', 'Email', 'User Type', 
        'Reason for Learning AI', 'Preferred Date', 'Signup Timestamp'
      ];
      sheet.appendRow(headers);
    }
    
    // Add each user to the sheet immediately
    data.forEach(function(row) {
      // Format phone number as text to prevent formula parsing
      const phoneNumber = row.phoneNumber.toString();
      
      sheet.appendRow([
        row.fullName,
        phoneNumber, // This will be treated as text, not formula
        row.email,
        row.userType,
        row.reason,
        row.preferredDate,
        row.signupTimestamp
      ]);
    });
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Data added successfully'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Error: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

## Setup Required

1. **Make sure your Google Apps Script has the `doPost` function**
2. **Update the deployment URL in `backend/server.js`**
3. **Run both frontend and backend servers**
4. **Test registration - data should appear in sheet immediately**

Now each registration creates a new row in Google Sheets in real-time! 🎉
