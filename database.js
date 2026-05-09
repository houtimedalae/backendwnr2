const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL
    ? { rejectUnauthorized: false }
    : false,
});

pool
  .connect()
  .then(() => console.log("🔥 PostgreSQL connecté"))
  .catch((err) => console.error("❌ DB ERROR:", err));

module.exports = pool;
