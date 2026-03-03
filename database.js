const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(path.join(__dirname, "database.db"), (err) => {
  if (err) console.error("Erreur SQLite:", err.message);
  else console.log("Connecté à SQLite (POO) !");
});

module.exports = db;
