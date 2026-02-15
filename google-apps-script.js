
/**
 * Google Apps Script for MFI Inspection Portal (Deduplication Enabled)
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(30000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);
    
    // আপনার স্ক্রিনশট অনুযায়ী হেডারের সঠিক নাম এবং ক্রম (A-Q)
    var headers = [
      "ক্র. নং",
      "শাখার নাম",
      "ঋণ গ্রহীতার নাম:, স্বামীর নাম:, গ্রাম: ও মোবাইল নং-",
      "উপজেলা",
      "জেলা",
      "ঋণের খাত",
      "ঋণ মঞ্জুরী ও বিতরণ এর তারিখ",
      "বিতরণকৃত ঋণের পরিমাণ",
      "গ্রাহক পর্যায়ে সুদের হার (ক্রমহ্রাসমান/ফ্ল্যাট)",
      "বিতরণকৃত ঋণের মোট ধার্যকৃত সুদের পরিমাণ",
      "নীতিমালা অনুযায়ী অন্যান্য আদায় (বীমা, পাশ বই, আবেদন পত্র ফি ইত্যাদি)",
      "ঋণের মেয়াদকাল",
      "কিস্তির সংখ্যা",
      "কিস্তির পরিমাণ",
      "পাশ বইয়ে হালনাগাদ লেনদেন সঠিকভাবে লিপিবদ্ধ করা হয়েছে কিনা",
      "ঋণ আদায় শুরুর তারিখ (যদি আদায় থাকে)",
      "পরিদর্শন দলের মন্তব্য"
    ];

    if (Array.isArray(data)) {
      data.forEach(function(item) {
        var bankName = item["ব্যাংক"] || "General_Records";
        var safeSheetName = bankName.substring(0, 31).replace(/[\[\]\?\*\\\/:]/g, "");
        var sheet = ss.getSheetByName(safeSheetName);
        
        if (!sheet) {
          sheet = ss.insertSheet(safeSheetName);
          sheet.appendRow(headers);
          sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#064e3b").setFontColor("#ffffff");
          sheet.setFrozenRows(1);
          // ID কলামটি কলাম R তে লুকিয়ে রাখার জন্য ব্যবহার করতে পারি
          sheet.getRange(1, 18).setValue("ID");
          sheet.hideColumns(18);
        }

        // ডুপ্লিকেট চেক: কলাম R (18) এ ID চেক করা হচ্ছে
        var entryId = item["ID"];
        var lastRow = sheet.getLastRow();
        var existingIds = lastRow > 1 ? sheet.getRange(2, 18, lastRow - 1, 1).getValues().flat() : [];
        
        if (existingIds.indexOf(entryId) === -1) {
          var rowValues = headers.map(function(h) {
            return item[h] !== undefined ? item[h] : "";
          });
          // ডাটা যোগ করা
          sheet.appendRow(rowValues);
          // শেষ রো এর কলাম R এ আইডি সেট করা
          sheet.getRange(sheet.getLastRow(), 18).setValue(entryId);
        }
      });
    }

    return ContentService.createTextOutput(JSON.stringify({ "result": "success" })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "message": error.toString() })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return HtmlService.createHtmlOutput("<div style='text-align:center;padding:50px;'><h1>✅ সিস্টেম সক্রিয় আছে</h1><p>গুগল শিট স্ক্রিপ্ট সফলভাবে কাজ করছে।</p></div>");
}
