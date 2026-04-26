const express = require("express");
const router = express.Router();
const db = require("../database");

/* =========================
   🔐 LOGIN ADMIN
========================= */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query(
      "SELECT * FROM admin WHERE email = $1 AND password = $2",
      [email, password]
    );

    const admin = result.rows[0];

    if (!admin) {
      return res.status(401).json({
        message: "Identifiants incorrects",
      });
    }

    res.json({
      message: "Login réussi",
      admin: {
        id: admin.id,
        email: admin.email,
      },
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
