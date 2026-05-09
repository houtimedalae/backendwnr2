const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

/* =========================
   MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   DATABASE
========================= */
const db = require("./database");

/* =========================
   ROUTES
========================= */
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/preinscriptions", require("./routes/preinscriptionRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));

/* =========================
   TEST ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("API RUNNING 🚀");
});

/* =========================
   LOGIN
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
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   DASHBOARD STATS
========================= */
app.get("/api/dashboard-stats", async (req, res) => {
  try {
    const courses = await db.query("SELECT COUNT(*) FROM courses");
    const events = await db.query("SELECT COUNT(*) FROM events");
    const preIns = await db.query("SELECT COUNT(*) FROM preinscriptions");

    const validated = await db.query(`
      SELECT validated, COUNT(*)::int AS count
      FROM preinscriptions
      GROUP BY validated
    `);

    const byCourse = await db.query(`
      SELECT c.title, COUNT(p.id)::int AS count
      FROM preinscriptions p
      LEFT JOIN courses c ON p.course_id = c.id
      GROUP BY c.title
      ORDER BY count DESC
    `);

    const topCourse = await db.query(`
      SELECT c.title, COUNT(p.id)::int AS count
      FROM preinscriptions p
      LEFT JOIN courses c ON p.course_id = c.id
      GROUP BY c.title
      ORDER BY count DESC
      LIMIT 1
    `);

    const lowCourse = await db.query(`
      SELECT c.title, COUNT(p.id)::int AS count
      FROM preinscriptions p
      LEFT JOIN courses c ON p.course_id = c.id
      GROUP BY c.title
      ORDER BY count ASC
      LIMIT 1
    `);

    res.json({
      courses: Number(courses.rows[0].count),
      events: Number(events.rows[0].count),
      preInscriptions: Number(preIns.rows[0].count),

      validated: validated.rows.map(v => ({
        validated: v.validated,
        count: Number(v.count),
      })),

      byCourse: byCourse.rows.map(c => ({
        title: c.title || "Unknown",
        count: Number(c.count),
      })),

      topCourse: topCourse.rows[0]
        ? {
            title: topCourse.rows[0].title,
            count: Number(topCourse.rows[0].count),
          }
        : null,

      lowCourse: lowCourse.rows[0]
        ? {
            title: lowCourse.rows[0].title,
            count: Number(lowCourse.rows[0].count),
          }
        : null,
    });
  } catch (err) {
    console.error("DASHBOARD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
