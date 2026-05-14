const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const {
  checkAndCreateAlert,
  getAllAlerts,
  getAlertsByWorker,
  resolveAlert
} = require("../controllers/alertController");

// =========================
// CREATE ALERT (ESP32)
// =========================
router.post(
  "/",
  checkAndCreateAlert
);

// =========================
// GET ALL ALERTS
// =========================
router.get(
  "/",
  protect,
  authorizeRoles("ADMIN", "SECURITY", "FACTORY_MANAGER", "SAFETY"),
  getAllAlerts
);

// =========================
// RESOLVE ALERT
// =========================
router.patch(
  "/:id/resolve",
  protect,
  authorizeRoles("ADMIN", "SECURITY", "FACTORY_MANAGER", "SAFETY"),
  resolveAlert
);

// =========================
// GET ALERTS BY WORKER
// =========================
router.get(
  "/worker/:workerID",
  protect,
  authorizeRoles("ADMIN", "SECURITY", "FACTORY_MANAGER", "SAFETY"),
  getAlertsByWorker
);

module.exports = router;