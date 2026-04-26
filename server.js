const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

/* =========================
   🔐 MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* =========================
   📦 DATABASE
========================= */
const db = require("./database");

/* =========================
   📚 ROUTES
========================= */
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/preinscriptions", require("./routes/preinscriptionRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));

/* =========================
   🔐 LOGIN
========================= */
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query(
      "SELECT * FROM admin WHERE email = $1 AND password = $2",
      [email, password]
    );

    const admin = result.rows[0];

    if (!admin) {
      return res.status(401).json({ message: "Identifiants incorrects" });
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

/* =========================
   📊 DASHBOARD STATS
========================= */
app.get("/api/dashboard-stats", async (req, res) => {
  try {
    const courses = await db.query("SELECT COUNT(*) FROM courses");
    const preIns = await db.query("SELECT COUNT(*) FROM preinscriptions");
    const events = await db.query("SELECT COUNT(*) FROM events");

    res.json({
      courses: parseInt(courses.rows[0].count),
      preInscriptions: parseInt(preIns.rows[0].count),
      events: parseInt(events.rows[0].count),
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

/* =========================
   🚀 SERVER START
========================= */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
