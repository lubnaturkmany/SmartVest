const { checkAndCreateAlert } = require("./alertController");
const { findWorkerByID } = require("./workerController");

const receiveSensorData = (req, res) => {
    try {
        const { workerID, temperature, gasLevel, heartRate } = req.body;

        // validation
        if (!workerID || temperature === undefined || gasLevel === undefined) {
            return res.status(400).json({
                error: "Missing required sensor data"
            });
        }
        // التأكد أن العامل موجود
        const worker = findWorkerByID(workerID);
              if (!worker) {
              return res.status(404).json({
              error: "Worker not found. Please register worker first."
            });
        }

        //  alertController استدعاء منطق التنبيه من
        const result = checkAndCreateAlert({
            workerID,
            temperature,
            gasLevel,
            heartRate
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
