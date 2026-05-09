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
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   📊 DASHBOARD STATS
========================= */
app.get("/api/dashboard-stats", async (req, res) => {
  try {

    // TOTALS (SAFE)
    const courses = await db.query("SELECT COUNT(*) FROM courses");
    const events = await db.query("SELECT COUNT(*) FROM events");
    const preIns = await db.query("SELECT COUNT(*) FROM preinscriptions");

    // VALIDATED FIX SAFE
    const validated = await db.query(`
      SELECT 
        validated,
        COUNT(*)::int AS count
      FROM preinscriptions
      GROUP BY validated
    `);

    // COURSES STATS (SAFE JOIN)
    const byCourse = await db.query(`
      SELECT 
        c.title,
        COUNT(p.id)::int AS count
      FROM preinscriptions p
      LEFT JOIN courses c ON p.courseid = c.id
      GROUP BY c.title
      ORDER BY count DESC
    `);

    // TOP COURSE
    const topCourse = await db.query(`
      SELECT 
        c.title,
        COUNT(p.id)::int AS count
      FROM preinscriptions p
      LEFT JOIN courses c ON p.courseid = c.id
      GROUP BY c.title
      ORDER BY count DESC
      LIMIT 1
    `);

    // LOW COURSE
    const lowCourse = await db.query(`
      SELECT 
        c.title,
        COUNT(p.id)::int AS count
      FROM preinscriptions p
      LEFT JOIN courses c ON p.courseid = c.id
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
        count: Number(v.count)
      })),

      byCourse: byCourse.rows.map(c => ({
        title: c.title || "Unknown",
        count: Number(c.count)
      })),

      topCourse: topCourse.rows[0]
        ? {
            title: topCourse.rows[0].title || "Unknown",
            count: Number(topCourse.rows[0].count)
          }
        : null,

      lowCourse: lowCourse.rows[0]
        ? {
            title: lowCourse.rows[0].title || "Unknown",
            count: Number(lowCourse.rows[0].count)
          }
        : null,
    });

  } catch (err) {
    console.error("DASHBOARD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});



/* =========================
   🚀 SERVER START
========================= */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});