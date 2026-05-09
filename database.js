const { Pool } = require("pg");
require("dotenv").config();

// 🔥 ON FORCE RENDER + LOCAL PROPRE
const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
      }
);

pool
  .connect()
  .then(() => console.log("🔥 PostgreSQL connecté"))
  .catch((err) => console.error("Erreur DB:", err));

module.exports = pool;
