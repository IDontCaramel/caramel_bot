const mineflayer = require("mineflayer");
const {
  pathfinder,
  Movements,
  goals: { GoalNear },
} = require("mineflayer-pathfinder");
const { TaskQueue } = require("mineflayer-utils");
const armorManager = require("mineflayer-armor-manager");

const cmd_chat = require("./commands/cmd_chat");
const cmd_movement = require("./commands/cmd_movement");
const cmd_admin = require("./commands/cmd_admin");
const admin_manager = require("./util/admin_manager");

const action_logger = require("./util/action_logger");

const server_options = {
  host: "localhost",
  port: 25565,
  username: "bot",
  //password: 'password'
};

const bot = mineflayer.createBot(server_options);

const prefix = "!"; // Define the command prefix
const commands = {}; // Object to hold command handlers

bot.loadPlugin(pathfinder);
bot.loadPlugin(armorManager);

function registerCommand(name, description, operator_level, handler) {
  console.log(`Registering command: ${name} on level: ${operator_level}`);
  if (typeof handler !== 'function') {
    console.error(`Error: The handler for command '${name}' is not a function.`);
    return;
  }
  commands[name] = {
    description,
    operator_level,
    handler,
  };
}

bot.once("spawn", () => {

  cmd_chat.registerCommands(registerCommand, bot, commands);
  cmd_admin.registerCommands(registerCommand, bot, commands);
  cmd_movement.registerCommands(registerCommand, bot, commands)
});



bot.on('soundEffectHeard', function(soundName, position,){
  console.log(position, soundName)
})



bot.on("chat", function (username, message) {
  handleMessage(username, message)
  action_logger.log_message_to_file(username, message);

});


bot.on("whisper", function (username, message){
  handleMessage(username, message)
  action_logger.log_message_to_file(username, `whisper: ${message}`);

})



function handleMessage(username, message) {

  // If the bot sends the message, ignore it
  if (username === bot.username) return;

  // Convert message to lowercase for case-insensitive comparison
  message = message.toLowerCase();

  // Check if the message starts with the command prefix
  if (message.startsWith(prefix)) {
    // Extract the command name (assuming the format: /command args)
    const commandName = message.slice(prefix.length).split(' ')[0].trim();
    const command = commands[commandName];

    if (command) {
      // Check if the user is an admin
      const isAdmin = admin_manager.is_admin(bot, username);
      
      // Determine the max allowed operator level based on admin status
      const maxOperatorLevel = isAdmin ? 2 : 1;

      // Check if the user has sufficient operator level to execute the command
      if (command.operator_level <= maxOperatorLevel) {
        // Execute the command handler
        command.handler(username, message);
      } else {
        // Inform the user they do not have permission
        bot.whisper(username, "You do not have permission to execute this command.");
      }
    } else {
      // Command not found
      bot.whisper(username, "Unknown command.");
    }
  }
}



bot.on("playerCollect", (collector, itemDrop) => {
  if (collector !== bot.entity) return;

  const queue = new TaskQueue();

  const sword = bot.inventory
    .items()
    .find((item) => item.name.includes("sword"));
  if (sword) {
    queue.add(async (cb) => {
      await bot.equip(sword, "hand");
      cb();
    });
  }

  const totem = bot.inventory
    .items()
    .find((item) => item.name.includes("totem"));
  if (totem) {
    queue.add(async (cb) => {
      await bot.equip(totem, "off-hand");
      cb();
    });
  }

  queue.runAll();
});


module.exports = {
  registerCommand,
  bot,
  commands,
};

/*
equip armor               [*]
eat food when hunrgy
log chat                  [*]
secret msg

*/
