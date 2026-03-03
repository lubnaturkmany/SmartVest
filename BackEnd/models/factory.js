const mongoose = require("mongoose");
const crypto = require("crypto");

const zoneSchema = new mongoose.Schema({
  zoneName: { type: String, required: true },
  type: { type: String, enum: ["gas", "temperature", "flame"], required: true },
  center: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  radius: { type: Number, required: true }, // نصف القطر بالمتر
  threshold: { type: Number, required: true } // قيمة التنبيه لكل نوع
});

const factorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  apiKey: { type: String, required: true, unique: true },
  zones: [zoneSchema]
}, { timestamps: true });

// API Key توليد تلقائي عند الإنشاء
factorySchema.pre("validate", function(next) {
  if (!this.apiKey) {
    this.apiKey = crypto.randomBytes(16).toString("hex"); // 32 char hex
  }
  next();
});

module.exports = mongoose.model("Factory", factorySchema);