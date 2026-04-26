const express = require("express");
const router = express.Router();
const Preinscription = require("../models/preinscriptionModel");

/* =========================
   📥 GET ALL
========================= */
router.get("/", async (req, res) => {
  try {
    const data = await Preinscription.getAll();
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
    const { studentName, phone, email, courseId } = req.body;

    // validation
    if (!studentName || !phone || !email || !courseId) {
      return res.status(400).json({ error: "Champs requis" });
    }

    if (!/^\d{10,12}$/.test(phone)) {
      return res.status(400).json({ error: "Numéro invalide" });
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ error: "Email invalide" });
    }

    const result = await Preinscription.create({
      studentName,
      phone,
      email,
      courseId,
    });

    res.status(201).json(result);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

/* =========================
   ✏️ VALIDATE (UPDATE)
========================= */
router.put("/:id", async (req, res) => {
  try {
    const updated = await Preinscription.validate(
      req.params.id,
      req.body.validated
    );

    if (!updated) {
      return res.status(404).json({ message: "Not found" });
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
    await Preinscription.delete(req.params.id);
    res.json({ deleted: req.params.id });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
