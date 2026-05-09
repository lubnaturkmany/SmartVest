const Alert = require("../models/alert");
const Worker = require("../models/worker");
const Factory = require("../models/factory");
const Zone = require("../models/zone");

// =========================
// حساب المسافة بين نقطتين
// =========================
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// =========================
// إنشاء Alert
// =========================
const checkAndCreateAlert = async (req, res) => {
  const {
    workerID,
    temperature,
    gasLevel,
    flameDetected,
    latitude,
    longitude
  } = req.body;

  let status = "Normal";
  let message = "";
  let hazardType = null;
  let zoneName = null;

  try {
    const worker = await Worker.findOne({ workerID }).populate("factory");

    if (!worker || !worker.factory) {
      return res.json({ status: "Normal", message: "" });
    }

    const zones = await Zone.find({ factory: worker.factory._id });

    for (let zone of zones) {
      const distance = calculateDistance(
        Number(latitude),
        Number(longitude),
        zone.center.lat,
        zone.center.lng
      );

      if (distance <= zone.radius) {

       let gasAlert = false;
       let tempAlert = false;
       let flameAlert = false;

       let hazardsCount = 0;
       let lastHazard = null;

        zoneName = zone.zoneName;

        // GAS
        if (zone.types.includes("gas")) {
          if (gasLevel > zone.threshold * 1.5) {
            gasAlert = true;
            hazardsCount++;
            lastHazard = "gas";
            status = "Danger";
          } 
          else if (gasLevel > zone.threshold) {
            gasAlert = true;
            lastHazard = "gas";
            status = status === "Danger" ? "Danger" : "Warning";
            message = `⚠️ Elevated gas level in ${zone.zoneName}`;
          }
        }

        // TEMPERATURE
        if (zone.types.includes("temperature")) {
          if (temperature > zone.threshold * 1.5) {
            tempAlert = true;
            hazardsCount++;
            lastHazard = "temperature";
            status = "Danger";
          } 
          else if (temperature > zone.threshold) {
            tempAlert = true;
            lastHazard = "temperature";
            status = status === "Danger" ? "Danger" : "Warning";
            message = `⚠️ Elevated temperature level in ${zone.zoneName}`;
          }
        }

        // FLAME
        if (zone.types.includes("flame") && flameDetected === true) {
          flameAlert = true;
          hazardsCount++;
          lastHazard = "flame";
          status = "Danger";
        }

        if (hazardsCount >= 2) {
          message = `🚨 CRITICAL ALERT: Multiple hazards detected in zone ${zone.zoneName}`;
          hazardType = lastHazard;
          status = "Danger";
        } else if (hazardsCount === 1) {
          if (lastHazard === "gas") {
            message = `🚨 High gas level in ${zone.zoneName}`;
          } else if (lastHazard === "temperature") {
            message = `🌡 High temperature in ${zone.zoneName}`;} else if (lastHazard === "flame") {
              message = `🔥 Flame detected in ${zone.zoneName}`;
            }
            hazardType = lastHazard;
          }
          

        // =========================
        // CREATE ALERT
        // =========================
        if (status === "Danger" || status === "Warning") {
          await Alert.create({
            workerID,
            type: status,
            hazardType,
            zone: zoneName,
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

          break;
        }
      }
    }

    return res.status(200).json({ status, message });

  } catch (error) {
    console.error("Alert processing error:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

// =========================
// Get All Alerts (pagination)
// =========================
const getAllAlerts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let filter = { isResolved: false };

    // 👇 إذا مش admin → فلترة حسب المصنع
    if (req.user.role !== "ADMIN") {
      filter.factory = req.user.factory;
    }

    const alerts = await Alert.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Alert.countDocuments(filter);

    return res.status(200).json({
      alerts,
      page,
      totalPages: Math.ceil(total / limit),
      totalAlerts: total
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// =========================
// Get Alerts by Worker
// =========================
const getAlertsByWorker = async (req, res) => {
  try {
    const { workerID } = req.params;

    const workerAlerts = await Alert.find({
      workerID,
      factory: req.user.factory
    }).sort({ date: -1 });

    return res.status(200).json(workerAlerts);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const resolveAlert = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("RESOLVE ID:", id);

    const updated = await Alert.findByIdAndUpdate(
      id,
      {
        isResolved: true
      },
      {
        new: true
      }
    );

    console.log("UPDATED ALERT:", updated);

    res.status(200).json(updated);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  checkAndCreateAlert,
  getAllAlerts,
  getAlertsByWorker,
  resolveAlert
};