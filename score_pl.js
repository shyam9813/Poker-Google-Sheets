function getScoreboardData() {
  Logger.log('Fetching scoreboard data...');

  const ss = SpreadsheetApp.openById('1lNJQ7hd6DJ_sGIquH23ufpi1taG3mYsKA5fsa-3IjII'); // Replace with your Spreadsheet ID
  const playersSheet = ss.getSheetByName('Players');
  const gameLogSheet = ss.getSheetByName('GameLog');

  // Get player data
  const playersData = playersSheet.getRange(2, 1, playersSheet.getLastRow() - 1, 2).getValues();
  Logger.log('Players Data: %s', JSON.stringify(playersData));
  if (!playersData || playersData.length === 0) {
    throw new Error('No player data found in the Players sheet.');
  }

  // Get results data from GameLog (Results column E)
  const lastRow = gameLogSheet.getRange("E:E").getValues().filter(String).length;
  Logger.log('GameLog Last Row: %d', lastRow);
  let resultsData = [];
  if (lastRow > 1) {
    resultsData = gameLogSheet.getRange(2, 5, lastRow - 1, 1).getValues();
    Logger.log('Results Data: %s', JSON.stringify(resultsData));
  } else {
    Logger.log('No results data found in column E.');
  }

  // Prepare form data for the last 5 games for each player
  const formMap = {};
  resultsData.reverse().forEach((row) => {
    const results = row[0]?.split(', ').map(r => r.split(':'));
    results?.forEach(([name, result]) => {
      if (!formMap[name]) formMap[name] = [];
      if (formMap[name].length < 5) formMap[name].push(result);
    });
  });

  // Prepare scoreboard data
  const scoreboard = playersData.map(([name, balance]) => {
    const form = formMap[name] || [];
    return {
      rank: 0, // Temporary rank
      name,
      balance: parseFloat(balance) || 0, // Ensure numeric balance
      form,
    };
  });

  // Sort by balance in descending order
  scoreboard.sort((a, b) => b.balance - a.balance);

  // Assign rank after sorting
  scoreboard.forEach((player, index) => {
    player.rank = index + 1;
  });

  Logger.log('Scoreboard Data: %s', JSON.stringify(scoreboard));
  return scoreboard;
}
