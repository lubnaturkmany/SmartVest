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
router.post("/", protect, authorizeRoles("ADMIN" , "HR"), addWorker);

// عرض كل العمال → Admin + Supervisor
router.get("/", protect, authorizeRoles("ADMIN", "HR" , "SECURITY"), getAllWorkers);

// عرض عامل معين → Admin + Supervisor
router.get("/:workerID", protect, authorizeRoles("ADMIN", "HR" , "SECURITY"), getWorkerByID);

// حذف عامل معين → Admin فقط
router.delete("/:workerID", protect, authorizeRoles("ADMIN"), deleteWorkerByID);

// حذف جميع العمال → Admin فقط
router.delete("/", protect, authorizeRoles("ADMIN"), deleteAllWorkers);

module.exports = router;