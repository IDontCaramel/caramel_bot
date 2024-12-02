const fs = require("fs").promises;

function log_message_to_file(username, message) {
  const now = new Date();
  const logFileName = `logs - ${now.getFullYear()}-${
    now.getMonth() + 1
  }-${now.getDate()}.txt`;
  const logFilePath = `./logs/${logFileName}`;

  const timestamp = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  const logContent = `${timestamp}-${username}: ${message}\n`;

  fs.stat(logFilePath)
    .then(() => fs.appendFile(logFilePath, logContent))
    .catch((err) => {
      if (err.code === "ENOENT") {
        return fs.writeFile(logFilePath, logContent);
      } else {
        console.error("Error checking file:", err);
        throw err;
      }
    })
    .catch((err) => console.error("Error writing to file:", err));
}

// async function logWrittenBookData(entity) {
//   // Check if the entity is a player or another type of entity
//   if (entity.type === "player") {
//     const item = entity.selectedItem;
//     if (item && item.name === "minecraft:written_book") {
//       // Extract book NBT data
//       const bookData = item.nbt || {}; // Fallback to an empty object if no NBT data
//       const logFilePath = `./logs/logged_books.json`;
//       const bookInfo = {
//         author: bookData.Author || "Unknown",
//         lore: bookData.Lore || "None",
//         pages: bookData.Pages || [],
//         nbt: bookData,
//       };

//       try {
//         // Check if the file exists
//         const fileExists = await fs.stat(logFilePath).catch(() => false);

//         let logs = [];
//         if (fileExists) {
//           // Read the existing data if the file exists
//           const fileContent = await fs.readFile(logFilePath, "utf-8");
//           try {
//             logs = JSON.parse(fileContent); // Parse the JSON data
//           } catch (parseErr) {
//             console.error("Error parsing existing JSON data:", parseErr);
//           }
//         }

//         // Append the new log entry to the logs array
//         logs.push(bookInfo);

//         // Write the updated logs array back to the file as a JSON string
//         await fs.writeFile(logFilePath, JSON.stringify(logs, null, 2)); // Indent with 2 spaces
//       } catch (err) {
//         console.error("Error reading/writing to the file:", err);
//       }
//     }
//   }
// }

module.exports = {
  log_message_to_file,
};
