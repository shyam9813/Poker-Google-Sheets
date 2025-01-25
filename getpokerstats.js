function getPokerGameStats() {
  const ss = SpreadsheetApp.openById('1lNJQ7hd6DJ_sGIquH23ufpi1taG3mYsKA5fsa-3IjII'); // Replace with your Spreadsheet ID
  const gameStatsSheet = ss.getSheetByName('GameStats');

  // Fetch all rows from GameStats sheet
  const data = gameStatsSheet.getRange(2, 1, gameStatsSheet.getLastRow() - 1, 6).getValues();

  // Format the data into an array of objects
  const stats = data.map(row => ({
    name: row[0],              // Name
    gamesPlayed: row[1],       // # of Games Played
    wins: row[2],              // # of Wins
    secondPlace: row[3],       // # of 2nd Place Finishes
    thirdPlace: row[4],        // # of 3rd Place Finishes
    outsideTop3: row[5],       // Outside Top 3 Finishes
  }));

  return stats;
}

// function doGet() {
//   return HtmlService.createHtmlOutputFromFile('PokerGameStats');
// }
