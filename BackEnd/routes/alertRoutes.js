const express = require("express"); 
const router = express.Router(); 
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
     getAllAlerts,
     getAlertsByWorker,
     checkAndCreateAlert 
      }= require("../controllers/alertController"); 
//GET api alerts 
router.get(
  "/",
  protect,
  authorizeRoles("ADMIN", "SECURITY" , "FACTORY_MANAGER"),
  getAllAlerts
);
//GET api alerts workerID 
router.get(
  "/:workerID",
  protect,
  authorizeRoles("ADMIN" , "SECURITY" , "FACTORY_MANAGER"),
  getAlertsByWorker
);
 
 module.exports=router;