const Factory = require("../models/factory");

const verifyApiKey = async (req, res, next) => {

  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({ error: "API Key required" });
  }

  const factory = await Factory.findOne({ apiKey });

  if (!factory) {
    return res.status(403).json({ error: "Invalid API Key" });
  }

  req.factory = factory; // نخزن المصنع بالطلب
  next();
};

module.exports = verifyApiKey;