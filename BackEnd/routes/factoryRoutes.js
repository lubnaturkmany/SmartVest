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
router.post("/", protect, authorizeRoles("ADMIN"), createFactory);
//router.post("/", createFactory);

// عرض كل المصانع → Admin فقط
router.get("/", protect, authorizeRoles("ADMIN"), getAllFactories);

// Zones إدارة 
router.post("/:factoryId/zones", protect, authorizeRoles("ADMIN", "SAFETY"), addZone);
router.put("/:factoryId/zones/:zoneId", protect, authorizeRoles("ADMIN", "SAFETY"), updateZone);
router.delete("/:factoryId/zones/:zoneId", protect, authorizeRoles("ADMIN", "SAFETY"), deleteZone);

module.exports = router;