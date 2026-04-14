const Alert = require("../models/alert");
const Worker = require("../models/worker");
const Factory = require("../models/factory");
// بتحسب المسافة
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // نصف قطر الأرض بالمتر

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // المسافة بالمتر
}

// تحديد حالة العامل وإنشاء التنبيه حسب منطقة المصنع
const checkAndCreateAlert = async ({
  workerID,
  temperature,
  gasLevel,
  flameDetected,
  latitude,
  longitude
}) => {

  let status = "Normal";
  let message = "";

  try {

    // نجيب العامل مع المصنع تبعه
    const worker = await Worker.findOne({ workerID }).populate("factory");

    if (!worker || !worker.factory) {
      return { status: "Normal", message: "" };
    }

    const zones = await Zone.find({ factory: worker.factory._id });

    // نمر على كل مناطق الخطر الخاصة بالمصنع
    for (let zone of factory.zones) {

      const distance = calculateDistance(
        Number(latitude),
        Number(longitude),
        zone.center.lat,
        zone.center.lng
      );

      // إذا العامل داخل نصف القطر
      if (distance <= zone.radius) {

        // Gas Zone
        if (zone.types.includes("gas") && gasLevel > zone.threshold) {
          status = "Danger";
          message = `🚨 High gas level in ${zone.zoneName}`;
        }

        // Temperature Zone
        if (zone.types.includes("temperature") && temperature > zone.threshold) {
          status = "Danger";
          message = `🌡 High temperature in ${zone.zoneName}`;
        }

        // Flame Zone
        if (zone.types.includes("flame") && flameDetected === true) {
          status = "Danger";
          message = `🔥 Flame detected in ${zone.zoneName}`;
        }

        // نخزن التنبيه ونوقف البحث → إذا صار خطر 
        if (status === "Danger") {
          await Alert.create({
            workerID,
            type: status,
            message,
            temperature,
            gasLevel,
            flameDetected,
            location: {
              latitude: Number(latitude),
              longitude: Number(longitude)
            },
             factory: worker.factory._id
          });

          break; // ما نكمل على باقي المناطق
        }
      }
    }

    return { status, message };

  } catch (error) {
    console.error("Alert processing error:", error.message);
    return { status: "Normal", message: "" };
  }
};

// عرض كل التنبيهات
const getAllAlerts = async (req, res) => {
    try {
        const alerts = await Alert.find({ factory: req.user.factory });
        res.status(200).json(alerts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// عرض تنبيهات عامل معين
const getAlertsByWorker = async (req, res) => {
  try {
    const { workerID } = req.params;

   const workerAlerts = await Alert.find({
    workerID,
    factory: req.user.factory 
}).sort({ date: -1 });

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
