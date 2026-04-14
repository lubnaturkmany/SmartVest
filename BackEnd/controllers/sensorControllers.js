const { checkAndCreateAlert } = require("./alertController");
const { findWorkerByID } = require("./workerControllers");
const Worker = require("../models/worker");
const Factory = require("../models/factory");

const receiveSensorData = async (req, res) => {
    try {
        const factory = req.factory;
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
        if (worker.factory.toString() !== req.factory._id.toString()) {
            return res.status(403).json({ error: "Worker does not belong to this factory" });
        }
        
        // ✅ تحديث موقع العامل الحالي
        await Worker.updateOne(
            { workerID },
            { 
                location: { type: "Point", coordinates: [lng, lat] },
                lastLocation: { lat, lng }
            }
        );

        //  alertController استدعاء منطق التنبيه من
        const result = await checkAndCreateAlert({
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