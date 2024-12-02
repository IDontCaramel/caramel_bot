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


  let currentTarget = null;
  registerCommand(
    "follow",
    "Makes the bot hover 100 blocks above the player's position and follow them until stopped.",
    2,
    (username, args) => {
      const msg = args.split(" ");
    if (msg.length < 2) {
      bot.whisper(username, "Please specify a player and a height.");
      return;
    }

    const targetPlayerName = msg[1];
    const targetHeight = parseInt(msg[2]);

    if (isNaN(targetHeight)) {
      bot.whisper(username, "Please specify a valid height (a number).");
      return;
    }

    const player = Object.values(bot.players).find(
      (p) => p.username.toLowerCase() === targetPlayerName.toLowerCase()
    );

    if (!player || !player.entity) {
      bot.whisper(username, "Player not found or not in range.");
      return;
    }

    if (currentTarget) {
      bot.whisper(
        username,
        `The bot is already following ${currentTarget.username}. Use the "stopfollow" command to stop.`
      );
      return;
    }

    currentTarget = player; // Set the current target
    bot.whisper(username, `Now following ${targetPlayerName}.`);
  
      // Get player's current position
      const playerPosition = player.entity.position.clone();
  
  
      // The target Y position (100 blocks above the player)
      const targetY = playerPosition.y + targetHeight;
  
      let stopFollowing = false; // Flag to control following behavior
  
      // Function to stop the bot's actions
      function stopBot() {
        stopFollowing = true;
        currentTarget = null; 
        // Check if the player entity is still available
        if (player && player.entity && player.entity.position) {
          const lastLocation = player.entity.position.clone();
          bot.whisper(
            username,
            `The bot stopped following the ${player} at: X=${lastLocation.x.toFixed(
              2
            )}, Y=${lastLocation.y.toFixed(2)}, Z=${lastLocation.z.toFixed(2)}`
          );
        } else {
          bot.whisper(username, "The bot stopped following, but the player's position could not be determined.");
        }
      }
  
      // Move the bot in steps of 10 blocks vertically
      const verticalInterval = setInterval(() => {
        if (stopFollowing) {
          clearInterval(verticalInterval);
          return;
        }
  
        const botY = bot.entity.position.y;
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
          if (stopFollowing) {
            clearInterval(horizontalInterval);
            return;
          }
  
          const botX = bot.entity.position.x;
          const botZ = bot.entity.position.z;
  
          const dx = playerPosition.x - botX;
          const dz = playerPosition.z - botZ;
  
          const newX = botX + Math.sign(dx) * Math.min(10, Math.abs(dx));
          const newZ = botZ + Math.sign(dz) * Math.min(10, Math.abs(dz));
  
          const botY = bot.entity.position.y;
          const newY = Math.max(botY, targetY);
  
          bot.entity.position.set(newX, newY, newZ);
  
          if (Math.abs(dx) <= 10 && Math.abs(dz) <= 10) {
            clearInterval(horizontalInterval);
            followPlayer();
          }
        }, 50); // Adjust horizontal position every 50ms
      }
  
      function followPlayer() {
        const followInterval = setInterval(() => {
          if (stopFollowing) {
            clearInterval(followInterval);
            return;
          }
  
          const playerPosition = player.entity.position.clone();
          bot.entity.position.set(playerPosition.x, targetY, playerPosition.z);
        }, 50); // Follow player every 50ms
      }
  
      // Register a command to stop the bot
      registerCommand("stopfollow", "Stops the bot from following the player.", 2, () => {
        stopBot();
      });
    }
  );
  
  
  
}

module.exports = { registerCommands };
