const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const coursesRouter = require("./routes/courses");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/courses", coursesRouter);

// Démarrer serveur
app.listen(PORT, () => {
  console.log(`Serveur backend pro démarré sur http://localhost:${PORT}`);
});
