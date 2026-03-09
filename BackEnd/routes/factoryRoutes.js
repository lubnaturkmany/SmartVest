const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
  createFactory,
  getAllFactories,
  addZone,
  updateZone,
  deleteZone
} = require("../controllers/factoryController");

// اول ادمن يسجل بالنظام
router.post("/", protect, authorizeRoles("Admin"), createFactory);
//router.post("/", createFactory);

// عرض كل المصانع → Admin فقط
router.get("/", protect, authorizeRoles("Admin"), getAllFactories);

// Zones إدارة 
router.post("/:factoryId/zones", protect, authorizeRoles("SystemAdmin"), addZone);
router.put("/:factoryId/zones/:zoneId", protect, authorizeRoles("SystemAdmin"), updateZone);
router.delete("/:factoryId/zones/:zoneId", protect, authorizeRoles("SystemAdmin"), deleteZone);

module.exports = router;