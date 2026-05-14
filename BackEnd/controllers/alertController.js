const { processAlert } = require("../services/alertService");

const checkAndCreateAlert = async (req, res) => {
  try {
    const result = await processAlert(req.body);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getAllAlerts = async (req, res) => {};
const getAlertsByWorker = async (req, res) => {};
const resolveAlert = async (req, res) => {};

module.exports = {
  checkAndCreateAlert,
  getAllAlerts,
  getAlertsByWorker,
  resolveAlert
};