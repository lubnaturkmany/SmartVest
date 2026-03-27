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
  apiKey: { type: String, required: true, default: () => crypto.randomBytes(16).toString("hex") },
  zones: { type: [zoneSchema], default: [] },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Factory", factorySchema);