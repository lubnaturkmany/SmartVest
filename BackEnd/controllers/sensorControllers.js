const { checkAndCreateAlert } = require("./alertController");
const { findWorkerByID } = require("./workerControllers");
const Worker = require("../models/worker");

const receiveSensorData = async (req, res) => {
    try {
        const { 
                  workerID, 
                  temperature, 
                  gasLevel, 
                  flameDetected,
                  latitude,
                  longitude 
                } = req.body;

        // validation
        if (!workerID || temperature === undefined || gasLevel === undefined || flameDetected === undefined || latitude === undefined || longitude === undefined) {
            return res.status(400).json({
                error: "Missing required sensor data"
            });
        }
        // التأكد أن العامل موجود
        const worker = await findWorkerByID(workerID);
              if (!worker) {
              return res.status(404).json({
              error: "Worker not found. Please register worker first."
            });
        }

        // ✅ تحديث موقع العامل الحالي
       await Worker.updateOne(
        { workerID },
        {
           lastLocation: {
           lat: Number(latitude),
           lng: Number(longitude)
              }
          }
        );

        //  alertController استدعاء منطق التنبيه من
        const result = checkAndCreateAlert({
            workerID,
            temperature,
            gasLevel,
            flameDetected,
            latitude,
            longitude
        });

        res.status(200).json({
            status: "received",
            currentStatus: result.status,
            alert: result.message
        });

    } catch (error) {
        res.status(500).json({
            error: "Server error"
        });
    }
};

module.exports = {
    receiveSensorData
};
