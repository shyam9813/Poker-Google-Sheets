// Fetch data from the PrizeRules sheet (ignores the header)
function getPrizeRulesData() {
  const ss = SpreadsheetApp.openById('1lNJQ7hd6DJ_sGIquH23ufpi1taG3mYsKA5fsa-3IjII'); // Replace with your Spreadsheet ID
  const prizeRulesSheet = ss.getSheetByName('PrizeRules');

  // Fetch all rows and columns from PrizeRules (ignoring the header)
  const data = prizeRulesSheet.getDataRange().getValues();

  // Return the data excluding the header
  return data.slice(1); // Skip the first row
}

// Update the PrizeRules sheet with edited data (preserve the header)
function updatePrizeRulesData(updatedData) {
  const ss = SpreadsheetApp.openById('1lNJQ7hd6DJ_sGIquH23ufpi1taG3mYsKA5fsa-3IjII'); // Replace with your Spreadsheet ID
  const prizeRulesSheet = ss.getSheetByName('PrizeRules');

  // Fetch the existing header row
  const header = prizeRulesSheet.getRange(1, 1, 1, prizeRulesSheet.getLastColumn()).getValues()[0];

  // Clear the existing data (excluding the header)
  prizeRulesSheet.clearContents();

  // Write the header back to the sheet
  prizeRulesSheet.getRange(1, 1, 1, header.length).setValues([header]);

  // Write the updated data below the header
  if (updatedData.length > 0) {
    prizeRulesSheet.getRange(2, 1, updatedData.length, updatedData[0].length).setValues(updatedData);
  }

  return { success: true, message: 'PrizeRules updated successfully!' };
}

// // Serve the HTML page
// function doGet() {
//   return HtmlService.createHtmlOutputFromFile('PrizeRulesPage');
// }
