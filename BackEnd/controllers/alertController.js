const Alert = require("../models/alert");

// تحديد الحالةالعامل وإنشاء التنبيه
const checkAndCreateAlert = async ({ workerID, temperature, gasLevel, flameDetected , latitude , longitude }) => {
    let status = "Normal";
    let message = "";

    const isDanger =
        flameDetected === true || 
        temperature > 39 ||
        gasLevel > 500;

    const isWarning =
        (temperature >= 37.5 && temperature <= 39) ||
        (gasLevel >= 300 && gasLevel <= 500);

    if (isDanger) {
        status = "Danger";
                if (flameDetected) {
            message = "🔥 Flame detected! Immediate evacuation required.";
        } else if (gasLevel > 500) {
            message = "🚨 Dangerous gas level detected!";
        } else {
            message = "🌡 Extremely high temperature detected!";
        }
    } else if (isWarning) {
        status = "Warning";
        message = "⚠ Warning: Abnormal readings. Monitor worker.";
    }

    // نخزنه اذا كانت في حالة خطر او تحذير   
   if (status !== "Normal") {
        const newAlert = new Alert({
            workerID,
            type: status,
            message,
            temperature,
            gasLevel,
            flameDetected,
            location: {
                latitude,
                longitude
            },    
            date: new Date()
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
