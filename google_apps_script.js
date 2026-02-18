// ==========================================
// GOOGLE APPS SCRIPT CODE (BACKEND)
// ==========================================

// INSTRUCTIONS:
// 1. Go to https://script.google.com/
// 2. Create a new project or open your existing one.
// 3. Paste this code into "Code.gs".
// 4. CRITICAL: Replace "YOUR_SPREADSHEET_ID_HERE" with your actual Spreadsheet ID (see below).
// 5. Click "Deploy" > "New Deployment" (or "Manage Deployments" -> "Edit" -> "New Version").
// 6. Copy the "Web App URL" and paste it into index.html (CLOUD_API_URL).

// HOW TO FIND YOUR SPREADSHEET ID:
// Open your Google Sheet. The URL looks like this:
// https://docs.google.com/spreadsheets/d/1BxiMvs0XRA5nSLd7jXJcEanXDYn0v3oMQz6Bb1BBqkk/edit
// The ID is: 1BxiMvs0XRA5nSLd7jXJcEanXDYn0v3oMQz6Bb1BBqkk
// Copy that string and paste it below.

const SHEET_ID = "1aTM_Cgvy1CKiEX4JTKuj6g1Jh6llEQ503R6Jzvl_ggk"; // <--- REPLACE THIS WITH YOUR SHEET ID !!!

function doPost(e) {
    const lock = LockService.getScriptLock();
    lock.tryLock(10000);

    try {
        const doc = SpreadsheetApp.openById(SHEET_ID);
        const data = JSON.parse(e.postData.contents);
        const sheetName = data.sheet; // 'Users' or 'Targets' or 'Settings'

        if (sheetName === 'Users') {
            const sheet = doc.getSheetByName("Users");
            // Create sheet if missing
            if (!sheet) {
                doc.insertSheet("Users");
                doc.getSheetByName("Users").appendRow(["Email", "Data"]);
                return ContentService.createTextOutput(JSON.stringify({ result: "created_sheet" })).setMimeType(ContentService.MimeType.JSON);
            }

            const users = data.users;

            // Clear old data (except header)
            if (sheet.getLastRow() > 1) {
                sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).clearContent();
            }

            // Prepare new rows
            const rows = [];
            Object.keys(users).forEach(email => {
                rows.push([email, JSON.stringify(users[email])]);
            });

            if (rows.length > 0) {
                sheet.getRange(2, 1, rows.length, 2).setValues(rows);
            }

            return ContentService.createTextOutput(JSON.stringify({ result: "success" })).setMimeType(ContentService.MimeType.JSON);
        }

        Logger.log("Received data for sheet: " + sheetName);

        // Handler for Settings
        if (sheetName === 'Settings') {
            const estPrice = data.estPricePerBox;
            Logger.log("Processing Settings. estPricePerBox: " + estPrice);
            if (estPrice) {
                // Find or create 'Settings' sheet
                let settingsSheet = doc.getSheetByName("Settings");
                if (!settingsSheet) {
                    Logger.log("Creating Settings sheet");
                    doc.insertSheet("Settings");
                    settingsSheet = doc.getSheetByName("Settings");
                    settingsSheet.appendRow(["Key", "Value"]);
                }

                // Clear and set
                settingsSheet.getRange("A2:B10").clearContent();
                settingsSheet.getRange("A2:B2").setValues([["estPricePerBox", estPrice]]);
                Logger.log("Settings written successfully");
            } else {
                Logger.log("No estPricePerBox found in data");
            }
        }

        return ContentService.createTextOutput(JSON.stringify({ result: "success" })).setMimeType(ContentService.MimeType.JSON);

    } catch (e) {
        return ContentService.createTextOutput(JSON.stringify({ result: "error", error: e.toString() })).setMimeType(ContentService.MimeType.JSON);

    } finally {
        lock.releaseLock();
    }
}

function doGet(e) {
    // This handles fetching data (Window.fetchCloudState)
    try {
        const doc = SpreadsheetApp.openById(SHEET_ID);

        // 1. Fetch Users
        const userSheet = doc.getSheetByName("Users");
        const users = {};
        if (userSheet && userSheet.getLastRow() > 1) {
            const data = userSheet.getRange(2, 1, userSheet.getLastRow() - 1, 2).getValues();
            data.forEach(row => {
                if (row[0]) users[row[0]] = JSON.parse(row[1]);
            });
        }

        // 2. Fetch Settings if needed
        // ... 

        const result = {
            users: users,
            // Add other state if needed
        };

        return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    } catch (e) {
        return ContentService.createTextOutput(JSON.stringify({ error: e.toString() })).setMimeType(ContentService.MimeType.JSON);
    }
}
