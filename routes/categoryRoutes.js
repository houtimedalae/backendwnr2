const express = require("express");
const router = express.Router();
const Category = require("../models/categoryModel");

/* =========================
   📂 GET ALL CATEGORIES
========================= */
router.get("/", async (req, res) => {
  try {
    const data = await Category.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

/* =========================
   ➕ CREATE CATEGORY
========================= */
router.post("/", async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ error: "Nom requis" });
    }

    const result = await Category.create(req.body.name);

    // gestion duplication propre
    if (result.error === "EXISTS") {
      return res.status(409).json({
        message: "Category already exists",
      });
    }

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

/* =========================
   ❌ DELETE CATEGORY
========================= */
router.delete("/:id", async (req, res) => {
  try {
    await Category.delete(req.params.id);
    res.json({ deleted: req.params.id });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
