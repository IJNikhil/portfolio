# Google Sheets Integration Guide

This guide explains how to connect your Admin Panel to a Google Sheet so you can manage your data (Projects, Skills, etc.) for free, without a complex backend.

## 1. Create the Google Sheet
1. Go to [sheets.google.com](https://sheets.google.com) and create a new sheet.
2. Name it `Portfolio_DB`.
3. Create the following tabs (sheets) at the bottom:
   - `Projects` (Columns: id, title, description, tags, link, github, category)
   - `Stats` (Columns: label, value)
   - `Contact` (Columns: name, email, message, date)

## 2. Create the Google Apps Script
1. In your Google Sheet, click `Extensions` > `Apps Script`.
2. Delete the default code and paste the code block below:

```javascript
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const doc = SpreadsheetApp.getActiveSpreadsheet();
    const requestBody = JSON.parse(e.postData.contents);
    const sheetName = requestBody.sheetName;
    const sheet = doc.getSheetByName(sheetName);
    
    // Example: Append Row
    if (requestBody.action === "POST") {
        const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
        const nextRow = sheet.getLastRow() + 1;
        const newRow = headers.map(header => requestBody.data[header] || "");
        sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);
        
        return ContentService.createTextOutput(JSON.stringify({ result: "success", row: nextRow }))
            .setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch (e) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", error: e.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  const sheetName = e.parameter.sheetName;
  const doc = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = doc.getSheetByName(sheetName);
  const rows = sheet.getDataRange().getValues();
  const headers = rows.shift();
  
  const data = rows.map(row => {
    const obj = {};
    headers.forEach((key, i) => obj[key] = row[i]);
    return obj;
  });
  
  return ContentService.createTextOutput(JSON.stringify({ data: data }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 3. Deploy the Script
1. Click `Deploy` > `New deployment`.
2. **Select type**: `Web app`.
3. **Description**: "Portfolio API".
4. **Execute as**: `Me`.
5. **Who has access**: `Anyone` (Important for the frontend to access it).
6. Click `Deploy`.
7. **Copy the 'Web App URL'**.

## 4. Connect to Portfolio
1. Open your project file: `src/services/googleSheets.ts`.
2. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with the URL you just copied.
3. Save the file.

✅ **Done!** Your portfolio services can now read/write to your Google Sheet.
