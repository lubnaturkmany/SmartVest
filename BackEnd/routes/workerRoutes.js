const express = require("express"); 
const router = express.Router(); 
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const { 
    addWorker, 
    getAllWorkers, 
    getWorkerByID,
    deleteWorkerByID,
    deleteAllWorkers 
      } = require("../controllers/workerControllers"); 
// إضافة عامل → Admin فقط
router.post("/", protect, authorizeRoles("Admin"), addWorker);

// عرض كل العمال → Admin + Supervisor
router.get("/", protect, authorizeRoles("Admin", "Supervisor"), getAllWorkers);

// عرض عامل معين → Admin + Supervisor
router.get("/:workerID", protect, authorizeRoles("Admin", "Supervisor"), getWorkerByID);

// حذف عامل معين → Admin فقط
router.delete("/:workerID", protect, authorizeRoles("Admin"), deleteWorkerByID);

// حذف جميع العمال → Admin فقط
router.delete("/", protect, authorizeRoles("Admin"), deleteAllWorkers);

module.exports = router;