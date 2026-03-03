// backend/server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database("./school.db", (err) => {
  if (err) console.error(err);
  else console.log("SQLite connecté !");
});

// Tables
db.run(`CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  price REAL,
  hours TEXT,
  category TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS preinscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  studentName TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  courseId INTEGER,
  validated INTEGER DEFAULT 0
)`);

db.run(`CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
)`);

// --- Endpoints Courses ---
app.get("/api/courses", (req, res) => {
  db.all("SELECT * FROM courses", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

app.post("/api/courses", (req, res) => {
  const { title, description, price, hours, category } = req.body;
  db.run(
    `INSERT INTO courses (title, description, price, hours, category) VALUES (?, ?, ?, ?, ?)`,
    [title, description, price, hours, category],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ id: this.lastID, title, description, price, hours, category });
    }
  );
});

// --- Endpoints Preinscriptions ---
app.get("/api/preinscriptions", (req, res) => {
  db.all("SELECT * FROM preinscriptions", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

app.post("/api/preinscriptions", (req, res) => {
  const { studentName, phone, email, courseId } = req.body;
  db.run(
    `INSERT INTO preinscriptions (studentName, phone, email, courseId) VALUES (?, ?, ?, ?)`,
    [studentName, phone, email, courseId],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ id: this.lastID });
    }
  );
});

// Valider une préinscription
app.put("/api/preinscriptions/:id", (req, res) => {
  const { id } = req.params;
  const { validated } = req.body; // 0 ou 1
  db.run(
    `UPDATE preinscriptions SET validated=? WHERE id=?`,
    [validated ? 1 : 0, id],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ updated: id });
    }
  );
});

// Supprimer une préinscription
app.delete("/api/preinscriptions/:id", (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM preinscriptions WHERE id=?`, [id], function (err) {
    if (err) return res.status(500).json(err);
    res.json({ deleted: id });
  });
});

// --- Endpoints Categories ---
app.get("/api/categories", (req, res) => {
  db.all("SELECT * FROM categories", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

app.post("/api/categories", (req, res) => {
  const { name } = req.body;
  db.run(`INSERT INTO categories (name) VALUES (?)`, [name], function (err) {
    if (err) return res.status(500).json(err);
    res.json({ id: this.lastID, name });
  });
});

app.delete("/api/categories/:id", (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM categories WHERE id=?`, [id], function (err) {
    if (err) return res.status(500).json(err);
    res.json({ deleted: id });
  });
});

// --- Dashboard stats ---
app.get("/api/dashboard-stats", (req, res) => {
  db.serialize(() => {
    db.get("SELECT COUNT(*) AS courses FROM courses", (err, courseRow) => {
      if (err) return res.status(500).json(err);
      db.get(
        "SELECT COUNT(*) AS preInscriptions FROM preinscriptions",
        (err, preRow) => {
          if (err) return res.status(500).json(err);
          res.json({
            courses: courseRow.courses,
            events: 0,
            preInscriptions: preRow.preInscriptions,
          });
        }
      );
    });
  });
});

app.listen(PORT, () => {
  console.log(`Backend lancé sur http://localhost:${PORT}`);
});
