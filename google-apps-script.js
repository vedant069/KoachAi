function doPost(e) {
  try {
    // Parse the JSON data from the request
    const request = JSON.parse(e.postData.contents);
    const data = request.data;
    const sheetUrl = request.sheetUrl;
    
    // Open the spreadsheet
    const ss = SpreadsheetApp.openByUrl(sheetUrl);
    const sheet = ss.getSheetByName('Registrations') || ss.insertSheet('Registrations');
    
    // Set headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Full Name', 
        'Phone Number', 
        'Email', 
        'User Type', 
        'Reason for Learning AI', 
        'Preferred Date',
        'Signup Timestamp'
      ];
      sheet.appendRow(headers);
    }
    
    // Add data rows
    data.forEach(function(row) {
      // Get the next row number
      const nextRow = sheet.getLastRow() + 1;
      
      // Set values individually to control formatting
      sheet.getRange(nextRow, 1).setValue(row.fullName);
      
      // Format phone number as text to prevent formula interpretation
      const phoneCell = sheet.getRange(nextRow, 2);
      phoneCell.setValue(row.phoneNumber);
      phoneCell.setNumberFormat('@'); // Format as text
      
      sheet.getRange(nextRow, 3).setValue(row.email);
      sheet.getRange(nextRow, 4).setValue(row.userType);
      sheet.getRange(nextRow, 5).setValue(row.reason);
      sheet.getRange(nextRow, 6).setValue(row.preferredDate);
      sheet.getRange(nextRow, 7).setValue(row.signupTimestamp);
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

function doGet() {
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'The web app is working correctly. Use POST to send data.'
  })).setMimeType(ContentService.MimeType.JSON);
}
