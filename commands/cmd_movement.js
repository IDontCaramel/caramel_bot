const { Movements, goals } = require('mineflayer-pathfinder');

function registerCommands(registerCommand, bot, commands) {
  // Set up pathfinding
  const movements = new Movements(bot, require('minecraft-data')(bot.version));
  bot.pathfinder.setMovements(movements);

  // Register the 'come' command
  registerCommand(
    "come",
    "Makes the bot come to the player's location.",
    1,
    (username, args) => {
      // If no player name is provided, return an error
      

      // Look up the target player's position
      const player = bot.players[username];

      if (!player) {
        bot.whisper(username, `Player '${username}' is not online or in my render distance.`);
        return;
      }

      const targetPosition = player.entity.position;
      if (!targetPosition) {
        bot.whisper(username, `Player '${username}' doesn't have a valid position.`);
        return;
      }

      // Use the pathfinder to move the bot to the player's location
      bot.pathfinder.setGoal(new goals.GoalNear(targetPosition.x, targetPosition.y, targetPosition.z, 1));

      bot.whisper(username, `The bot is on its way to ${username}'s location.`);
    }
  );

  registerCommand(
    "setpos",
    "Makes the bot hover 100 blocks above the player's position and follow them for 20 seconds.",
    1,
    (username, args) => {
      const player = bot.players[username];
      if (!player) {
        bot.chat("Player not found.");
        return;
      }
  
      // Get player's current position
      const playerPosition = player.entity.position.clone();
  
      // Store the bot's original position
      const originalBotPosition = bot.entity.position.clone();
  
      // The target Y position (100 blocks above the player)
      const targetY = playerPosition.y + 20;
  
      // Move the bot in steps of 10 blocks vertically
      const verticalInterval = setInterval(() => {
        const botY = bot.entity.position.y;
        // Check if the bot is within 10 blocks of the target Y level
        if (Math.abs(botY - targetY) <= 10) {
          clearInterval(verticalInterval); // Stop moving vertically
          moveToHorizontalPosition(); // Start horizontal adjustment
        } else {
          bot.entity.position.set(
            bot.entity.position.x,
            Math.min(botY + 10, targetY), // Move in steps of 10, or stop at targetY
            bot.entity.position.z
          );
        }
      }, 50); // Adjust vertical position every 50ms
  
      function moveToHorizontalPosition() {
        const horizontalInterval = setInterval(() => {
          const botX = bot.entity.position.x;
          const botZ = bot.entity.position.z;
  
          const dx = playerPosition.x - botX;
          const dz = playerPosition.z - botZ;
  
          // Move closer to the player's horizontal position
          const newX = botX + Math.sign(dx) * Math.min(10, Math.abs(dx));
          const newZ = botZ + Math.sign(dz) * Math.min(10, Math.abs(dz));
  
          // Compensate to maintain the target altitude
          const botY = bot.entity.position.y;
          const newY = Math.max(botY, targetY); // Ensure the bot doesn't fall
  
          bot.entity.position.set(newX, newY, newZ);
  
          // Stop if the bot has reached the player's horizontal position
          if (Math.abs(dx) <= 10 && Math.abs(dz) <= 10) {
            clearInterval(horizontalInterval);
            followPlayer(); // Start following the player
          }
        }, 50); // Adjust horizontal position every 50ms
      }
  
      function followPlayer() {
        const followInterval = setInterval(() => {
          const playerPosition = player.entity.position.clone(); // Update player's current position
          bot.entity.position.set(playerPosition.x, targetY, playerPosition.z); // Maintain altitude while following
        }, 50); // Follow player every 50ms
  
        // Stop following after 20 seconds
        setTimeout(() => {
          clearInterval(followInterval); // Stop following
          bot.entity.position.set(
            originalBotPosition.x,
            originalBotPosition.y,
            originalBotPosition.z
          ); // Return to the original position
          bot.chat("The bot has returned to its original position.");
        }, 20000); // Follow for 20 seconds
      }
    }
  );
  
  
  
}

module.exports = { registerCommands };
