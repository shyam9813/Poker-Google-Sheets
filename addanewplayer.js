// Function to validate and add a new player
function addPlayer(name) {
  const ss = SpreadsheetApp.openById('1lNJQ7hd6DJ_sGIquH23ufpi1taG3mYsKA5fsa-3IjII'); // Replace with your Spreadsheet ID
  const playersSheet = ss.getSheetByName('Players');
  
  // Fetch all existing names
  const existingNames = playersSheet.getRange(2, 1, playersSheet.getLastRow() - 1, 1).getValues().flat();
  const lowerCaseNames = existingNames.map(n => n.toLowerCase());

  // Check for duplicate
  if (lowerCaseNames.includes(name.toLowerCase())) {
    return { success: false, message: `Name "${name}" already exists.` };
  }

  // Add the new name to the next available row
  const nextRow = playersSheet.getLastRow() + 1;
playersSheet.getRange(nextRow, 1).setValue(name).setFontWeight('bold'); // Add Name in Bold
playersSheet.getRange(nextRow, 2).setValue(0).setHorizontalAlignment('center'); // Add Balance (0) Center-Aligned


  return { success: true, message: `Name "${name}" added successfully with a balance of 0.` };
}

// Function to serve the HTML form
// function doGet() {
//   return HtmlService.createHtmlOutputFromFile('Newplayer');
// }
