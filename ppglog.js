function updatePPGLogFromGameLog() {
  const ss = SpreadsheetApp.openById('1lNJQ7hd6DJ_sGIquH23ufpi1taG3mYsKA5fsa-3IjII'); // Replace with your Spreadsheet ID
  const gameLogSheet = ss.getSheetByName('GameLog');
  const ppgLogSheet = ss.getSheetByName('PPG_log');
  const playersSheet = ss.getSheetByName('Players');
  const prizeRulesSheet = ss.getSheetByName('PrizeRules');

  // Fetch data
  const gameLogData = gameLogSheet.getDataRange().getValues();
  const ppgLogData = ppgLogSheet.getDataRange().getValues();
  const playersData = playersSheet.getRange(2, 1, playersSheet.getLastRow() - 1, 1).getValues().flat();
  const prizeRulesData = prizeRulesSheet.getDataRange().getValues();

  // Ensure player names are set as headers in PPG_log
  const ppgHeaders = ppgLogData[0] || [];
  const playerHeaders = ['# of Players', 'Participants', 'Date', 'Game ID', ...playersData];
  if (!ppgHeaders.length || !ppgHeaders.every((header, index) => header === playerHeaders[index])) {
    ppgLogSheet.clear();
    ppgLogSheet.appendRow(playerHeaders);
  }

  // Process each row in Game Log
  for (let i = 1; i < gameLogData.length; i++) {
    const row = gameLogData[i];
    const [numPlayers, participants, gameDate, gameID, resultsRaw] = row;

    // Skip already processed rows
    if (ppgLogData.some(logRow => logRow[3] === gameID)) {
      continue;
    }

    // Parse participants and results
    const participantList = participants.split(', ');
    const results = {};
    resultsRaw.split(', ').forEach(result => {
      const [name, position] = result.split(':');
      results[name] = position;
    });

    // Fetch prize rules for the number of players
    const prizeRow = prizeRulesData.find(row => row[0] === numPlayers);
    if (!prizeRow) {
      Logger.log(`No prize rules found for ${numPlayers} players.`);
      continue;
    }
    const [_, firstPrize, secondPrize, thirdPrize, buyIn] = prizeRow;

    if (!buyIn) {
      Logger.log(`No buy-in amount found for ${numPlayers} players.`);
      continue;
    }

    // Prepare new row for PPG_log
    const newRow = [numPlayers, participants, gameDate, gameID];
    playersData.forEach(player => {
      if (participantList.includes(player)) {
        let balanceChange = -buyIn; // Deduct buy-in dynamically from PrizeRules tab
        if (results[player] === '1st') balanceChange += firstPrize;
        else if (results[player] === '2nd') balanceChange += secondPrize;
        else if (results[player] === '3rd') balanceChange += thirdPrize;
        newRow.push(balanceChange);
      } else {
        newRow.push(''); // Leave blank for non-participants
      }
    });

    // Add the row to PPG_log
    ppgLogSheet.appendRow(newRow);
    Logger.log('Added to PPG_log: %s', newRow);

    // // Update player balances in Players tab
    // participantList.forEach(participant => {
    //   const playerIndex = playersData.indexOf(participant);
    //   if (playerIndex > -1) {
    //     const balanceCell = playersSheet.getRange(playerIndex + 2, 2);
    //     const currentBalance = parseFloat(balanceCell.getValue()) || 0;
    //     const newBalance = currentBalance + parseFloat(newRow[4 + playerIndex]);
    //     balanceCell.setValue(newBalance);
    //     Logger.log('Updated %s balance: %f -> %f', participant, currentBalance, newBalance);
    //   }
    // });
  }
}
