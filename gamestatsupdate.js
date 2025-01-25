function updateGameStats() {
  const ss = SpreadsheetApp.openById('1lNJQ7hd6DJ_sGIquH23ufpi1taG3mYsKA5fsa-3IjII'); // Replace with your Spreadsheet ID
  const playersSheet = ss.getSheetByName('Players');
  const gameLogSheet = ss.getSheetByName('GameLog');
  const gameStatsSheet = ss.getSheetByName('GameStats');

  // Fetch names from Players sheet
  const players = playersSheet.getRange(2, 1, playersSheet.getLastRow() - 1, 1).getValues().flat();

  // Fetch existing names from GameStats sheet
  const existingNames = gameStatsSheet.getRange(2, 1, gameStatsSheet.getLastRow() - 1, 1).getValues().flat();

  // Determine new names to add
  const newNames = players.filter(player => !existingNames.includes(player));

  // Add new names to the GameStats sheet
  if (newNames.length > 0) {
    const startRow = existingNames.length + 2; // Start after the last existing row
    newNames.forEach((name, index) => {
      gameStatsSheet.getRange(startRow + index, 1).setValue(name); // Add each new name
    });
    Logger.log(`Added new names to GameStats: ${newNames.join(', ')}`);
  }

  // Initialize a stats object
  const stats = {};
  const allNames = [...existingNames, ...newNames]; // Combine existing and new names
  allNames.forEach(player => {
    stats[player] = {
      gamesPlayed: 0,
      wins: 0,
      secondPlace: 0,
      thirdPlace: 0,
      outsideTop3: 0,
    };
  });

  // Parse the GameLog sheet
  const gameLogData = gameLogSheet.getDataRange().getValues();
  gameLogData.forEach((row, index) => {
    if (index === 0) return; // Skip header row
    const results = row[4]; // Results column
    if (!results) return;

    results.split(', ').forEach(result => {
      const [player, position] = result.split(':');
      if (!stats[player]) return; // Ignore if the player is not in the Players sheet

      stats[player].gamesPlayed += 1; // Increment games played
      if (position === '1st') stats[player].wins += 1;
      if (position === '2nd') stats[player].secondPlace += 1;
      if (position === '3rd') stats[player].thirdPlace += 1;
      if (position === 'none') stats[player].outsideTop3 += 1;
    });
  });

  // Update the GameStats sheet
  allNames.forEach((player, index) => {
    const row = index + 2; // Row index in GameStats
    gameStatsSheet.getRange(row, 2).setValue(stats[player].gamesPlayed);
    gameStatsSheet.getRange(row, 3).setValue(stats[player].wins);
    gameStatsSheet.getRange(row, 4).setValue(stats[player].secondPlace);
    gameStatsSheet.getRange(row, 5).setValue(stats[player].thirdPlace);
    gameStatsSheet.getRange(row, 6).setValue(stats[player].outsideTop3);
  });

  Logger.log('GameStats sheet updated successfully!');
}
