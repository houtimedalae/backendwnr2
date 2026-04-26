const db = require("../database");

class Preinscription {

  /* =========================
     📥 GET ALL PREINSCRIPTIONS
  ========================= */
  static async getAll() {
    const result = await db.query(`
      SELECT 
        p.id,
        p.studentname AS "studentName",
        p.phone,
        p.email,
        p.courseid AS "courseId",
        c.title AS "courseName",
        p.validated
      FROM preinscriptions p
      LEFT JOIN courses c ON p.courseid = c.id
      ORDER BY p.id DESC
    `);

    return result.rows;
  }

  /* =========================
     ➕ CREATE PREINSCRIPTION
  ========================= */
  static async create(data) {
    const { studentName, phone, email, courseId } = data;

    const result = await db.query(
      `INSERT INTO preinscriptions (studentname, phone, email, courseid)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [studentName, phone, email, courseId]
    );

    return result.rows[0];
  }

  /* =========================
     ✏️ VALIDATE PREINSCRIPTION
  ========================= */
  static async validate(id, validated) {
    const result = await db.query(
      `UPDATE preinscriptions
       SET validated = $1
       WHERE id = $2
       RETURNING *`,
      [validated ? 1 : 0, id]
    );

    return result.rows[0];
  }

  /* =========================
     ❌ DELETE PREINSCRIPTION
  ========================= */
  static async delete(id) {
    await db.query(
      `DELETE FROM preinscriptions WHERE id = $1`,
      [id]
    );
  }
}

module.exports = Preinscription;
