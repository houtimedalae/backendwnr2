const db = require("../database");

class Course {
  constructor(id, title, description, price, schedule) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.price = price;
    this.schedule = schedule;
  }

  static createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        price REAL,
        schedule TEXT
      )
    `;
    db.run(sql);
  }

  static getAll(callback) {
    db.all("SELECT * FROM courses", [], (err, rows) => {
      callback(err, rows);
    });
  }

  static create(data, callback) {
    const { title, description, price, schedule } = data;
    const sql = `INSERT INTO courses (title, description, price, schedule) VALUES (?, ?, ?, ?)`;
    db.run(sql, [title, description, price, schedule], function (err) {
      callback(err, this.lastID);
    });
  }

  static update(id, data, callback) {
    const { title, description, price, schedule } = data;
    const sql = `UPDATE courses SET title = ?, description = ?, price = ?, schedule = ? WHERE id = ?`;
    db.run(sql, [title, description, price, schedule, id], function (err) {
      callback(err, this.changes);
    });
  }

  static delete(id, callback) {
    const sql = `DELETE FROM courses WHERE id = ?`;
    db.run(sql, [id], function (err) {
      callback(err, this.changes);
    });
  }
}

module.exports = Course;
