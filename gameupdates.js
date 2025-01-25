function processGameUpdate(data) {
  const ss = SpreadsheetApp.openById('1lNJQ7hd6DJ_sGIquH23ufpi1taG3mYsKA5fsa-3IjII'); // Replace with your Spreadsheet ID
  const playersSheet = ss.getSheetByName('Players');
  const gameLogSheet = ss.getSheetByName('GameLog');
  const prizeRulesSheet = ss.getSheetByName('PrizeRules');
  const emailID = Session.getActiveUser().getEmail(); // Get email ID of the user

  const { numPlayers, participants, firstPlace, secondPlace, thirdPlace, gameDate } = data;

  // Fetch prize rules for the given number of players
  const prizeRulesData = prizeRulesSheet.getDataRange().getValues();
  const prizeRule = prizeRulesData.find(row => row[0] == numPlayers);
  if (!prizeRule) {
    return { success: false, message: `No prize rules found for ${numPlayers} players.` };
  }

  const [_, firstPrize, secondPrize, thirdPrize, buyIn] = prizeRule; // Extract buy-in from column E

  if (!buyIn) {
    return { success: false, message: `Buy-In amount not found for ${numPlayers} players.` };
  }

  // Update balances in the Players tab
  const playersData = playersSheet.getDataRange().getValues();
  const playerBalances = Object.fromEntries(playersData.slice(1).map(row => [row[0], row[1]]));

  participants.forEach(player => {
    if (!playerBalances.hasOwnProperty(player)) {
      return { success: false, message: `Player "${player}" not found in Players tab.` };
    }

    let balanceChange = -buyIn; // Default deduction for buy-in
    if (player === firstPlace) balanceChange += firstPrize;
    else if (player === secondPlace) balanceChange += secondPrize;
    else if (player === thirdPlace) balanceChange += thirdPrize;

    // Update balance in Players tab
    const rowIndex = playersData.findIndex(row => row[0] === player);
    playersSheet.getRange(rowIndex + 1, 2).setValue(playerBalances[player] + balanceChange);
  });

  // Construct the results string
  const results = participants.map(player => {
    if (player === firstPlace) return `${player}:1st`;
    if (player === secondPlace) return `${player}:2nd`;
    if (player === thirdPlace) return `${player}:3rd`;
    return `${player}:none`;
  }).join(', ');

  // Construct Game ID
  const gameID = `PocketMonsters_${Utilities.formatDate(new Date(gameDate), Session.getScriptTimeZone(), 'yyyyMMdd')}_Game${gameLogSheet.getLastRow()}`;

  // Append to Game Log sheet
  const newRow = [
    numPlayers,
    participants.join(', '),
    gameDate,
    gameID,
    results,
    emailID
  ];
  const newRowIndex = gameLogSheet.getLastRow() + 1;

  gameLogSheet.appendRow(newRow);

  // Set font size for the Results column
  gameLogSheet.getRange(newRowIndex, 5).setFontSize(6);

  return { success: true, message: 'Game Log updated successfully, and balances updated!' };
}


function getPlayersList() {
  const ss = SpreadsheetApp.openById('1lNJQ7hd6DJ_sGIquH23ufpi1taG3mYsKA5fsa-3IjII'); // Replace with your Spreadsheet ID
  const playersSheet = ss.getSheetByName('Players');
  const lastRow = playersSheet.getLastRow();
  if (lastRow < 2) return []; // No players to fetch

  return playersSheet.getRange(2, 1, lastRow - 1, 1).getValues().flat();
}

function getNumberOfPlayersOptions() {
  // Return an array of numbers from 4 to 9 for the dropdown options
  return [4, 5, 6, 7, 8, 9];
}
