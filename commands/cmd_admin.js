const loggedPlayers = [];

// Log when a player enters the bot's distance
function log_player_information(bot, entity) {  
  if (entity.type === "player" && loggedPlayers.includes(entity.username)) {
    const playerWhoIssuedCommand = loggedPlayers.find(entity.username);
    bot.whisper(
      playerWhoIssuedCommand.by ,`${entity.username} has come into my distance.`
    );

    console.log(playerWhoIssuedCommand.by, entity.username)
  }
}

// Add a player to the log list
function log_add_player(playerToLog, by, bot) {
  if (!loggedPlayers.includes(playerToLog)) {
    loggedPlayers.push(playerToLog);
    bot.whisper(by, `Player ${playerToLog} has been added to the log list.`);
  } else {
    bot.whisper(by, `Player ${playerToLog} is already in the log list.`);
  }
}

function log_remove_player(playerToRemove, by, bot) {
  const index = loggedPlayers.indexOf(playerToRemove);

  if (index !== -1) {
    loggedPlayers.splice(index, 1);
    bot.whisper(
      by,
      `Player ${playerToRemove} has been removed from the log list.`
    );
  } else {
    bot.whisper(by, `Player ${playerToRemove} is not in the log list.`);
  }
}

function registerCommands(registerCommand, bot, commands) {
  registerCommand(
    "logplayer",
    "Logs a player into the log list",
    2,
    (username, args) => {
      if (args.length === 0) {
        bot.whisper(username, "Please specify a player to log.");
        return;
      }
      const playerToLog = args[0];
      log_add_player(playerToLog, username, bot);
    }
  );

  registerCommand(
    "removeplayer",
    "Removes a player from the log list",
    2,
    (username, args) => {
      if (args.length === 0) {
        bot.whisper(username, "Please specify a player to remove.");
        return;
      }
      const playerToRemove = args[0];
      log_remove_player(playerToRemove, username, bot);
    }
  );
}

module.exports = {
  registerCommands,
  log_player_information,
};
