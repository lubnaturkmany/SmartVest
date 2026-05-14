const { processAlert } = require("../services/alertService");
const Alert = require("../models/alert");

const checkAndCreateAlert = async (req, res) => {
  try {
    console.log("REQUEST ARRIVED");
    console.log(req.body);
    const result = await processAlert(req.body);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// =========================
// GET ALL ALERTS
// =========================
const getAllAlerts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const alerts = await Alert.find({ isResolved: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Alert.countDocuments({ isResolved: false });

    return res.status(200).json({
      alerts,
      page,
      totalPages: Math.ceil(total / limit),
      totalAlerts: total
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
// =========================
// GET ALERTS BY WORKER
// =========================
const getAlertsByWorker = async (req, res) => {
  try {
    const { workerID } = req.params;

    const alerts = await Alert.find({ workerID })
      .sort({ createdAt: -1 });

    return res.status(200).json(alerts);

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// =========================
// RESOLVE ALERT
// =========================
const resolveAlert = async (req, res) => {
  try {
    const updated = await Alert.findByIdAndUpdate(
      req.params.id,
      { isResolved: true },
      { new: true }
    );

    return res.status(200).json(updated);

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// =========================
// EXPORTS
// =========================
module.exports = {
  checkAndCreateAlert,
  getAllAlerts,
  getAlertsByWorker,
  resolveAlert
};