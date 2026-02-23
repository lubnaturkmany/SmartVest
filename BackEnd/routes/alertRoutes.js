const express = require("express"); 
const router = express.Router(); 
const {
     getAllAlerts,
     getAlertsByWorker,
     checkAndCreateAlert 
      }= require("../controllers/alertController"); 
//GET api alerts 
router.get("/alerts",getAllAlerts); 
//GET api alerts workerID 
 router.get("/alerts/:workerID",getAlertsByWorker); 
 
 module.exports=router;