function registerCommands(registerCommand, bot, commands) {
  registerCommand("help", "Lists all commands", 1, (username, args) => {
    const helpMessage = Object.entries(commands)
      .map(([name, cmd]) => `!${name}: ${cmd.description}`)
      .join("\n");

    bot.whisper(username, `Available commands:\n${helpMessage}`);
  });

  registerCommand(
    "secretmsg",
    "Messages someone using the bot as a proxy",
    1,
    (username, message) => {
      // Split the message into arguments, separating by space
      const args = message.split(" ");

      // Check if the user provided both a target player and a message
      if (args.length < 2) {
        bot.whisper(username, "invalid player.");
        return;
      } else if (args.length < 3) {
        bot.whisper(username, "invalid message.");
        return;
      }

      const playerToMsg = args[1];
      const msg = `secretmsg: ${args[2]}`;

      bot.whisper(playerToMsg, msg);
    }
  );
}

module.exports = { registerCommands };
