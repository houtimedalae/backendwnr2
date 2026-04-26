const db = require("../database");

class Category {

  /* =========================
     📂 GET ALL
  ========================= */
  static async getAll() {
    try {
      const result = await db.query(
        "SELECT * FROM categories ORDER BY id DESC"
      );

      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  /* =========================
     ➕ CREATE
  ========================= */
  static async create(name) {
    try {
      const check = await db.query(
        "SELECT * FROM categories WHERE name = $1",
        [name]
      );

      if (check.rows.length > 0) {
        return { error: "EXISTS" };
      }

      const result = await db.query(
        "INSERT INTO categories (name) VALUES ($1) RETURNING *",
        [name]
      );

      return result.rows[0];
    } catch (err) {
      throw err;
    }
  }

  /* =========================
     ❌ DELETE
  ========================= */
  static async delete(id) {
    try {
      await db.query(
        "DELETE FROM categories WHERE id = $1",
        [id]
      );
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Category;
