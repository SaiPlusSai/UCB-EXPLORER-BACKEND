const express = require("express");
const cors = require("cors");

const routes = require("../routes/index");
const errorHandler = require("../middleware/errorHandler");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "ngrok-skip-browser-warning"
  ],
}));

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: "Recurso no encontrado"
  });
});

app.use(errorHandler);

module.exports = app;