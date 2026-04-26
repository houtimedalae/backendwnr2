const express = require("express");
const router = express.Router();
const Course = require("../models/courseModel");

/* =========================
   📚 GET ALL
========================= */
router.get("/", async (req, res) => {
  try {
    const data = await Course.getAll();
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

/* =========================
   ➕ CREATE
========================= */
router.post("/", async (req, res) => {
  try {
    if (!req.body.title) {
      return res.status(400).json({ error: "Titre requis" });
    }

    const result = await Course.create(req.body);
    res.status(201).json(result);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

/* =========================
   ✏️ UPDATE (IMPORTANT)
========================= */
router.put("/:id", async (req, res) => {
  try {
    console.log("UPDATE ID:", req.params.id);
    console.log("BODY:", req.body);

    const updated = await Course.update(req.params.id, req.body);

    if (!updated) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(updated);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

/* =========================
   ❌ DELETE
========================= */
router.delete("/:id", async (req, res) => {
  try {
    await Course.delete(req.params.id);
    res.json({ deleted: req.params.id });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
