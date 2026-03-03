const mongoose = require("mongoose");

const zoneSchema = new mongoose.Schema({
  zoneName: String,
  type: {
    type: String,
    enum: ["gas", "temperature", "flame"]
  },
  threshold: Number,
  radius: Number, // بالمتر
  center: {
    lat: Number,
    lng: Number
  }
});

const factorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  apiKey: {
  type: String,
  required: true,
  unique: true
},
  zones: [zoneSchema]
}, { timestamps: true });


module.exports = mongoose.model("Factory", factorySchema);