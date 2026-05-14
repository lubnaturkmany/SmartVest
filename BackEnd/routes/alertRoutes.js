const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const {
  getAllAlerts,
  getAlertsByWorker,
  resolveAlert
} = require("../controllers/alertController");

router.get(
  "/",
  protect,
  authorizeRoles("ADMIN", "SECURITY", "FACTORY_MANAGER", "SAFETY"),
  getAllAlerts
);

router.patch(
  "/:id/resolve",
  protect,
  authorizeRoles("ADMIN", "SECURITY", "FACTORY_MANAGER", "SAFETY"),
  resolveAlert
);

router.get(
  "/worker/:workerID",
  protect,
  authorizeRoles("ADMIN", "SECURITY", "FACTORY_MANAGER", "SAFETY"),
  getAlertsByWorker
);

module.exports = router;