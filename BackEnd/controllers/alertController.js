const Alert = require("../models/alert");

// تحديد الحالةالعامل وإنشاء التنبيه
const checkAndCreateAlert = async ({ workerID, temperature, gasLevel, heartRate }) => {

    let status = "Normal";
    let message = "";

    const isDanger =
        temperature > 39 ||
        gasLevel > 500 ||
        (heartRate !== undefined && heartRate > 130);

    const isWarning =
        (temperature >= 37.5 && temperature <= 39) ||
        (gasLevel >= 300 && gasLevel <= 500) ||
        (heartRate !== undefined && heartRate > 100 && heartRate <= 130);

    if (isDanger) {
        status = "Danger";
        message = "High risk detected! Immediate action required.";
    } else if (isWarning) {
        status = "Warning";
        message = "Warning: Abnormal readings. Monitor worker.";
    }

    // نخزنه اذا كانت في حالة خطر او تحذير   
   if (status !== "Normal") {
        const newAlert = new Alert({
            workerID,
            type: status,
            message,
            temperature,
            gasLevel,
            heartRate,
            time: new Date()
        });

        await newAlert.save();
    }

    return { status, message };
};

// عرض كل التنبيهات
const getAllAlerts = async (req, res) => {
    try {
        const alerts = await Alert.find();
        res.status(200).json(alerts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// عرض تنبيهات عامل معين
const getAlertsByWorker = async (req, res) => {
    try {
        const { workerID } = req.params;

        const workerAlerts = await Alert.find({ workerID });

        res.status(200).json(workerAlerts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    checkAndCreateAlert,
    getAllAlerts,
    getAlertsByWorker
};
