function doGet(e) {
  const page = e.parameter.page || 'default'; // Get the page parameter or default to 'GameUpdatePage'

  switch (page) {
    case 'GameUpdatePage':
      return HtmlService.createHtmlOutputFromFile('GameUpdatePage')
        .setTitle('Game Update');
    case 'PrizeRulesPage':
      return HtmlService.createHtmlOutputFromFile('PrizeRulesPage')
        .setTitle('Prize Rules');
    case 'Newplayer':
      return HtmlService.createHtmlOutputFromFile('Newplayer')
        .setTitle('Add New Player');
    case 'PokerGameStats':
      return HtmlService.createHtmlOutputFromFile('PokerGameStats')
        .setTitle('Poker Game Stats');
    case 'Scoreboard':
      return HtmlService.createHtmlOutputFromFile('Scoreboard')
        .setTitle('Scoreboard');
    case 'Scoreboard_PL':
      return HtmlService.createHtmlOutputFromFile('Scoreboard_PL')
        .setTitle('Scoreboard_PL');
    default:
      return HtmlService.createHtmlOutputFromFile('Scoreboard')
        .setTitle('Scoreboard'); // Default page
  }
}