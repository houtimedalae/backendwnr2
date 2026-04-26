const db = require("../database");

class EventModel {
  // 📥 GET ALL EVENTS
  static async getAll() {
    try {
      const result = await db.query(
        "SELECT * FROM events ORDER BY id DESC"
      );
      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  // ➕ CREATE EVENT
  static async create(data) {
    const { title, description, date, image } = data;

    try {
      const result = await db.query(
        `INSERT INTO events (title, description, date, image)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [title, description, date, image]
      );

      return result.rows[0];
    } catch (err) {
      throw err;
    }
  }

  // ❌ DELETE EVENT
  static async delete(id) {
    try {
      await db.query(
        "DELETE FROM events WHERE id = $1",
        [id]
      );

      return { message: "Event deleted" };
    } catch (err) {
      throw err;
    }
  }
}

module.exports = EventModel;
