const express = require("express"); 
const router = express.Router(); 
const { 
    addWorker, 
    getAllWorkers, 
    getWorkerByID 
      } = require("../controllers/workerController"); 
// إضافة عامل 
router.post("/workers", addWorker); 
// عرض كل العمال 
 router.get("/workers", getAllWorkers);
// عرض عامل معيّن 
router.get("/workers/:workerID", getWorkerByID);

module.exports = router;