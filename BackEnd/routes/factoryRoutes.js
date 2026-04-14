const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
  getAllFactories,
  addZone,
  updateZone,
  deleteZone,
  getZones
} = require("../controllers/factoryController");


//router.post("/", createFactory);

// عرض كل المصانع → Admin فقط
router.get("/", protect, authorizeRoles("ADMIN"), getAllFactories);

// Zones إدارة 
router.post("/:factoryId/zones", protect, authorizeRoles("ADMIN","FACTORY_MANAGER", "SAFETY"), addZone);
router.put("/:factoryId/zones/:zoneId", protect, authorizeRoles("ADMIN", "FACTORY_MANAGER", "SAFETY"), updateZone);
router.delete("/:factoryId/zones/:zoneId", protect, authorizeRoles("ADMIN", "FACTORY_MANAGER", "SAFETY"), deleteZone);
// ← جديد: Admin يجلب كل الزونات بغض النظر عن المصنع
router.get("/zones/all", protect, authorizeRoles("ADMIN"), getZones);
router.get("/:factoryId/zones", protect, authorizeRoles("ADMIN", "FACTORY_MANAGER", "SAFETY"),getZones);

module.exports = router;