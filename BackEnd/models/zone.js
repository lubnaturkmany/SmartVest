const mongoose = require("mongoose");

const zoneSchema = new mongoose.Schema({
  zoneName: { 
    type: String, required: true 
},

  types: {
    type: [String],
    enum: ["gas", "temperature", "flame", "all"], 
    default: ["gas", "temperature", "flame"]
},

  center: {
    lat: Number,
    lng: Number
},
  radius: Number,
  threshold: Number,

  factory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Factory",
    required: true
}
}, { timestamps: true });

module.exports = mongoose.model("Zone", zoneSchema);