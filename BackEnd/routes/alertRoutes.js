const express = require("express"); 
const router = express.Router(); 
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
     getAllAlerts,
     getAlertsByWorker,
     checkAndCreateAlert,
     resolveAlert
      }= require("../controllers/alertController"); 
//GET api alerts 
router.get(
  "/",
  protect,
  authorizeRoles("ADMIN", "SECURITY" , "FACTORY_MANAGER","SAFETY"),
  getAllAlerts
);

router.patch(
  "/:id/resolve",
  protect,
  authorizeRoles("ADMIN", "SECURITY", "FACTORY_MANAGER","SAFETY"),
  resolveAlert
);

//GET api alerts workerID 
router.get(
  "/:workerID",
  protect,
  authorizeRoles("ADMIN" , "SECURITY" , "FACTORY_MANAGER","SAFETY"),
  getAlertsByWorker
);

router.post(
  "/",
  protect,
  authorizeRoles("ADMIN", "SECURITY", "FACTORY_MANAGER","SAFETY"),
  checkAndCreateAlert
);

 
 module.exports=router;