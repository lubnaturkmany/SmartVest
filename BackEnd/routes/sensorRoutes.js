const express=require("express");
const router=express.Router();
const { receiveSensorData }= require("../controllers/sensorControllers");
router.post("/sensor-data",receiveSensorData);
module.exports=router;