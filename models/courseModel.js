const db = require("../database");

class Course {

  /* =========================
     📚 GET ALL COURSES
  ========================= */
  static async getAll() {
    const result = await db.query(
      "SELECT * FROM courses ORDER BY id DESC"
    );
    return result.rows;
  }

  /* =========================
     ➕ CREATE COURSE
  ========================= */
  static async create(course) {
    const { title, description, price, hours, category } = course;

    const result = await db.query(
      `INSERT INTO courses (title, description, price, hours, category)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, description, price, hours, category]
    );

    return result.rows[0];
  }

  /* =========================
     ✏️ UPDATE COURSE
  ========================= */
  static async update(id, course) {
    const { title, description, price, hours, category } = course;

    const result = await db.query(
      `UPDATE courses
       SET title = $1,
           description = $2,
           price = $3,
           hours = $4,
           category = $5
       WHERE id = $6
       RETURNING *`,
      [title, description, price, hours, category, id]
    );

    return result.rows[0];
  }

  /* =========================
     ❌ DELETE COURSE
  ========================= */
  static async delete(id) {
    await db.query(
      "DELETE FROM courses WHERE id = $1",
      [id]
    );
  }
}

module.exports = Course;
