/**
 * Google Apps Script — Daily Production Report Receiver
 *
 * This script receives POST requests from the xma-forms Next.js app
 * and writes each submission into the correct employee tab in the Google Sheet.
 *
 * DEPLOYMENT INSTRUCTIONS:
 * 1. Open your target Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Delete any existing code and paste this entire file
 * 4. Click Deploy > New Deployment
 * 5. Select type: "Web app"
 * 6. Execute as: "Me" (your Google account)
 * 7. Who has access: "Anyone"
 * 8. Click Deploy and copy the Web App URL
 * 9. Add the URL to your .env.local file:
 *    GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
 *
 * HOW IT WORKS:
 * - Each employee gets their own tab (created on first submission)
 * - Array entries (shoots, edits, accounts) are flattened into one row per entry
 * - Core fields (date, workMode, notes) are repeated on each row
 * - Flat fields (like scriptsWritten) go into a single row
 * - LockService prevents race conditions from concurrent submissions
 */

var CORE_FIELDS = ["date", "workMode", "notes"];
var META_FIELDS = ["employee", "employeeName"];
var ENTRY_ARRAYS = ["shootEntries", "editingEntries", "accountEntries"];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    var data = JSON.parse(e.postData.contents);
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var employeeName = data.employeeName;

    if (!employeeName) {
      return jsonResponse({ status: "error", message: "Missing employeeName" });
    }

    var coreValues = {};
    CORE_FIELDS.forEach(function (key) {
      if (data[key] !== undefined) coreValues[key] = data[key];
    });

    var flatFields = {};
    Object.keys(data).forEach(function (key) {
      if (
        META_FIELDS.indexOf(key) === -1 &&
        CORE_FIELDS.indexOf(key) === -1 &&
        ENTRY_ARRAYS.indexOf(key) === -1
      ) {
        flatFields[key] = data[key];
      }
    });

    var rows = [];

    ENTRY_ARRAYS.forEach(function (arrayKey) {
      if (!data[arrayKey] || !Array.isArray(data[arrayKey])) return;

      var entryType = arrayKey
        .replace("Entries", "")
        .replace(/([A-Z])/g, " $1")
        .trim();

      data[arrayKey].forEach(function (entry) {
        var row = { Timestamp: new Date().toISOString(), entryType: entryType };

        CORE_FIELDS.forEach(function (key) {
          if (coreValues[key] !== undefined) row[key] = coreValues[key];
        });

        Object.keys(entry).forEach(function (key) {
          row[key] = entry[key];
        });

        Object.keys(flatFields).forEach(function (key) {
          row[key] = flatFields[key];
        });

        rows.push(row);
      });
    });

    if (rows.length === 0) {
      var row = { Timestamp: new Date().toISOString() };

      CORE_FIELDS.forEach(function (key) {
        if (coreValues[key] !== undefined) row[key] = coreValues[key];
      });

      Object.keys(flatFields).forEach(function (key) {
        row[key] = flatFields[key];
      });

      rows.push(row);
    }

    var sheet = spreadsheet.getSheetByName(employeeName);

    if (!sheet) {
      sheet = spreadsheet.insertSheet(employeeName);
      var headers = buildHeaders(rows);
      sheet.appendRow(headers);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    }

    var headers = sheet
      .getRange(1, 1, 1, sheet.getLastColumn())
      .getValues()[0];

    var newHeaders = findNewHeaders(rows, headers);
    if (newHeaders.length > 0) {
      var lastCol = headers.length;
      newHeaders.forEach(function (h) {
        lastCol++;
        sheet.getRange(1, lastCol).setValue(h).setFontWeight("bold");
        headers.push(h);
      });
    }

    rows.forEach(function (row) {
      var values = headers.map(function (header) {
        return row[header] !== undefined ? row[header] : "";
      });
      sheet.appendRow(values);
    });

    return jsonResponse({ status: "success", employee: employeeName, rows: rows.length });
  } catch (error) {
    return jsonResponse({ status: "error", message: error.toString() });
  } finally {
    lock.releaseLock();
  }
}

function buildHeaders(rows) {
  var seen = {};
  var ordered = ["Timestamp", "date", "workMode", "entryType", "client"];

  ordered.forEach(function (h) { seen[h] = true; });

  rows.forEach(function (row) {
    Object.keys(row).forEach(function (key) {
      if (!seen[key]) {
        ordered.push(key);
        seen[key] = true;
      }
    });
  });

  return ordered;
}

function findNewHeaders(rows, existingHeaders) {
  var existing = {};
  existingHeaders.forEach(function (h) { existing[h] = true; });

  var newOnes = [];
  var seen = {};

  rows.forEach(function (row) {
    Object.keys(row).forEach(function (key) {
      if (!existing[key] && !seen[key]) {
        newOnes.push(key);
        seen[key] = true;
      }
    });
  });

  return newOnes;
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function doGet() {
  return ContentService.createTextOutput(
    "Daily Report API is running. Use POST to submit reports."
  ).setMimeType(ContentService.MimeType.TEXT);
}
