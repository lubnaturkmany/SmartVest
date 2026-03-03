const express=require("express");
const router=express.Router();
const verifyApiKey = require("../middleware/apiKeyMiddleware");
const { receiveSensorData }= require("../controllers/sensorControllers");
router.post("/sensor-data", verifyApiKey, receiveSensorData);
module.exports=router;