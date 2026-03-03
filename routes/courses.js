const express = require("express");
const router = express.Router();
const Course = require("../models/Course");

// Créer la table au démarrage
Course.createTable();

// GET /api/courses
router.get("/", (req, res) => {
  Course.getAll((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST /api/courses
router.post("/", (req, res) => {
  Course.create(req.body, (err, id) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id });
  });
});

// PUT /api/courses/:id
router.put("/:id", (req, res) => {
  Course.update(req.params.id, req.body, (err, changes) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes });
  });
});

// DELETE /api/courses/:id
router.delete("/:id", (req, res) => {
  Course.delete(req.params.id, (err, deleted) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted });
  });
});

module.exports = router;
