const express = require("express");
const router = express.Router();

const authAdminRoutes = require("../modules/auth-admin/routes/authAdminRoutes");
const carreraRoutes = require("../modules/career/routes/carreraRoutes");
const colegioRoutes = require("../modules/ticket-access-visitor/routes/colegioRoutes");
const visitorAccessRoutes = require("../modules/ticket-access-visitor/routes/visitorAccessRoutes");
const triviaRoutes = require("../modules/trivia/routes/triviaRoutes");
const rewardsRoutes = require("../modules/rewards/routes/rewardsRoutes");
const feedbackRoutes = require("../modules/feedback/routes/feedbackRoutes");
const qrRoutes = require("../modules/qr/routes/qrRoutes");
const reminderRoutes = require("../modules/reminders/routes/reminderRoutes");
const analyticsRoutes = require("../modules/analytics/routes/analyticsRoutes");

router.get("/", (req, res) => {
  res.json({
    ok: true,
    name: "UCB Explorer API",
    version: "1.0.0",
    modulos: [
      "auth-admin",
      "career",
      "ticket-access-visitor",
      "trivia",
      "rewards",
      "feedback",
      "qr",
      "reminders",
      "analytics",
    ],
  });
});

router.get("/health", async (req, res) => {
  res.json({ ok: true, status: "up", time: new Date().toISOString() });
});

router.use("/auth/admin", authAdminRoutes);
router.use("/carreras", carreraRoutes);
router.use("/colegios", colegioRoutes);
router.use("/visitantes", visitorAccessRoutes);
router.use("/trivia", triviaRoutes);
router.use("/premios", rewardsRoutes);
router.use("/feedback", feedbackRoutes);
router.use("/qr", qrRoutes);
router.use("/recordatorios", reminderRoutes);
router.use("/analytics", analyticsRoutes);

module.exports = router;
