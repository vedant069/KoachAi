# AI Education Platform

A modern web application for managing AI education registrations with a React frontend and Node.js backend.

## Project Structure

```
project/
├── src/                    # React frontend
├── backend/               # Node.js backend proxy
├── .env                   # Frontend environment variables
├── .env.example          # Frontend environment template
└── README.md
```

## Features

- User registration form for AI education sessions
- Admin dashboard with authentication
- Google Sheets integration for data storage
- Modern, responsive UI with Tailwind CSS
- CORS-compliant backend proxy
- Environment-based configuration

## Environment Setup

### Frontend (.env)
```env
VITE_BACKEND_URL=http://localhost:3001
```

### Backend (backend/.env)
```env
PORT=3001
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
GOOGLE_SHEET_URL=https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
API_TIMEOUT=30000
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Apps Script web app (for Google Sheets integration)

## Setup Instructions

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:3001`

### 2. Frontend Setup

```bash
# Navigate to project root
cd ..

# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### 3. Google Apps Script Setup

1. Go to your Google Sheet: https://docs.google.com/spreadsheets/d/1p0ILBSwfAnAAQYmB7Y-d6UGMJ1vT2DiNj8iHbxuttTU/edit
2. Click on Extensions > Apps Script
3. Replace the code with the following:

```javascript
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
      sheet.appendRow([
        row.fullName,
        row.phoneNumber,
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

function doGet() {
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'The web app is working correctly. Use POST to send data.'
  })).setMimeType(ContentService.MimeType.JSON);
}
```

4. Save the script with a name like "AI Education Data Handler"
5. Click Deploy > New deployment
6. Select type: Web app
7. Set:
   - Description: AI Education Data Handler
   - Execute as: Me (your Google account)
   - Who has access: Anyone
8. Click "Deploy"
9. Copy the Web app URL and update it in `backend/server.js` if different

## Running the Application

### Development Mode

1. **Start Backend** (Terminal 1):
```bash
cd backend
npm run dev
```

2. **Start Frontend** (Terminal 2):
```bash
npm run dev
```

3. **Access the Application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

### Admin Access

Default admin credentials:
- Username: `admin`
- Password: `password`

(These can be changed in the App.tsx file)

## API Endpoints

### Backend

- `GET /` - Health check
- `POST /api/google-sheets` - Proxy to Google Apps Script

## Technologies Used

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Lucide React (icons)
- Axios (HTTP client)
- Vite (build tool)

### Backend
- Node.js
- Express.js
- CORS middleware
- Axios (HTTP client)
- dotenv (environment variables)

## Environment Variables

### Backend (.env)
```
PORT=3001
```

## Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure:
1. The backend server is running on port 3001
2. The frontend is making requests to `http://localhost:3001/api/google-sheets`
3. CORS is properly configured in the backend

### Google Apps Script Issues
1. Ensure the script is deployed as a web app
2. Check that permissions are granted
3. Verify the web app URL is correct in the backend
4. Make sure "Who has access" is set to "Anyone"

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
