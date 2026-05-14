const Alert = require("../models/alert");
const Worker = require("../models/worker");
const Zone = require("../models/zone");

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

const processAlert = async ({
  workerID,
  temperature,
  gasLevel,
  flameDetected,
  latitude,
  longitude
}) => {

  let status = "Normal";
  let message = "";

  const worker = await Worker.findOne({ workerID }).populate("factory");
  if (!worker?.factory) return { status, message };

  const zones = await Zone.find({ factory: worker.factory._id });

  for (let zone of zones) {
    const distance = calculateDistance(
      latitude,
      longitude,
      zone.center.lat,
      zone.center.lng
    );

    if (distance > zone.radius) continue;

    let hazards = 0;
    let last = null;

    if (zone.types.includes("gas") && gasLevel > zone.threshold) {
      hazards++;
      last = "gas";
      status = gasLevel > zone.threshold * 1.5 ? "Danger" : "Warning";
    }

    if (zone.types.includes("temperature") && temperature > zone.threshold) {
      hazards++;
      last = "temperature";
      status = temperature > zone.threshold * 1.5 ? "Danger" : "Warning";
    }

    if (zone.types.includes("flame") && flameDetected) {
      hazards++;
      last = "flame";
      status = "Danger";
    }

    if (hazards === 0) return { status, message };

    if (hazards >= 2) {
      message = `🚨 CRITICAL ALERT in ${zone.zoneName}`;
      status = "Danger";
    } else {
      message = `⚠️ ${last} detected in ${zone.zoneName}`;
    }

    if (status !== "Normal") {
      await Alert.create({
        workerID,
        type: status,
        hazardType: last,
        zone: zone.zoneName,
        message,
        temperature,
        gasLevel,
        flameDetected,
        location: { latitude, longitude },
        factory: worker.factory._id
      });

      return { status, message };
    }
  }

  return { status, message };
};

module.exports = { processAlert };