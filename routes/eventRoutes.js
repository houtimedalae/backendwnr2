const express = require("express");
const router = express.Router();

const EventModel = require("../models/eventModel");

/* =========================
   📥 GET ALL EVENTS
========================= */
router.get("/", async (req, res) => {
  try {
    const data = await EventModel.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({
      message: "Erreur serveur GET events",
      error: err,
    });
  }
});

/* =========================
   ➕ CREATE EVENT
========================= */
router.post("/", async (req, res) => {
  try {
    const { title, description, date, image } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title requis" });
    }

    const result = await EventModel.create({
      title,
      description,
      date,
      image,
    });

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({
      message: "Erreur serveur CREATE event",
      error: err,
    });
  }
});

/* =========================
   ❌ DELETE EVENT
========================= */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await EventModel.delete(id);

    res.json({ deleted: id });
  } catch (err) {
    res.status(500).json({
      message: "Erreur serveur DELETE event",
      error: err,
    });
  }
});

module.exports = router;
