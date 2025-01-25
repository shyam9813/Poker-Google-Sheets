function getScoreboardData() {
  const ss = SpreadsheetApp.openById('1lNJQ7hd6DJ_sGIquH23ufpi1taG3mYsKA5fsa-3IjII'); // Replace with your Spreadsheet ID
  const playersSheet = ss.getSheetByName('Players');
  const playersData = playersSheet.getDataRange().getValues();

  // Process data: exclude header and calculate ranks
  const players = playersData.slice(1) // Skip header
    .map((row, index) => ({
      rank: index + 1,
      name: row[0], // Assuming Name is in column A
      balance: parseFloat(row[1]) || 0 // Assuming Balance is in column B
    }))
    .sort((a, b) => b.balance - a.balance); // Sort by balance descending

  return players.map((player, index) => ({
    rank: index + 1,
    name: player.name,
    balance: player.balance.toFixed(2)
  }));
}

// function doGet() {
//   return HtmlService.createHtmlOutputFromFile('Scoreboard');
// }