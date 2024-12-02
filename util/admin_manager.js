const fs = require("fs");

const uuid_json = "admins.json";

function is_admin(bot, username) {
  const uuid = get_player_uuid(bot, username);

  if (uuid != null) {
    const admins = getAdminsFromFile(uuid_json);

    for (let admin of admins) {
      if (uuid == admin) {
        return true;
      }
    }

    return false;
  } else {
    return false;
  }
}

function get_player_uuid(bot, username) {
  const playerInfo = bot.players[username];
  if (playerInfo) {
    return playerInfo.uuid;
  } else {
    console.log(`Player ${username} is not visible to the bot.`);
    return null;
  }
}

const getAdminsFromFile = (filePath) => {
  // Read the file synchronously
  const jsonData = fs.readFileSync(filePath, "utf8");

  // Parse the JSON data
  const data = JSON.parse(jsonData);

  // Return the admins array
  return data.admins;
};

function add_admin_to_file(adminUuid) {
  const jsonData = fs.readFileSync(uuid_json, "utf8");

  const data = JSON.parse(jsonData);

  if (!data.admins.includes(adminUuid)) {
    data.admins.push(adminUuid);

    fs.writeFileSync(uuid_json, JSON.stringify(data, null, 2), "utf8");
    console.log(`Admin with UUID ${adminUuid} added.`);
  } else {
    console.log(`Admin with UUID ${adminUuid} already exists.`);
  }
}

module.exports = {
  is_admin,
  get_player_uuid,
  add_admin_to_file
};
