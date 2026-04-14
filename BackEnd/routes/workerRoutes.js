const express = require("express"); 
const router = express.Router(); 
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const { 
    addWorker, 
    getAllWorkers, 
    getWorkerByID,
    deleteWorkerByID,
    deleteAllWorkers,
    updateWorkerLocation 
  } = require("../controllers/workerControllers"); 
// إضافة عامل → Admin فقط
router.post("/", protect, authorizeRoles("ADMIN" , "FACTORY_MANAGER"), addWorker);

// عرض كل العمال → Admin + SECURITY + FACTORY_MANAGER
router.get("/", protect, authorizeRoles("ADMIN", "SECURITY" , "FACTORY_MANAGER"), getAllWorkers);

// عرض عامل معين → Admin + SECURITY + FACTORY_MANAGER
router.get("/:workerID", protect, authorizeRoles("ADMIN", "SECURITY" , "FACTORY_MANAGER"), getWorkerByID);

// حذف عامل معين → Admin فقط
router.delete("/:workerID", protect, authorizeRoles("ADMIN" , "FACTORY_MANAGER"), deleteWorkerByID);

// حذف جميع العمال → Admin فقط
router.delete("/", protect, authorizeRoles("ADMIN" , "FACTORY_MANAGER"), deleteAllWorkers);

//تحديث موقع العامل 
router.put("/:workerID/location", updateWorkerLocation);

module.exports = router;