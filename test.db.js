const db = require("./database");

db.query("SELECT NOW()", (err, res) => {
  if (err) console.log("DB error:", err);
  else console.log("🔥 PostgreSQL OK:", res.rows);
});
