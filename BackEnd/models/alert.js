const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
    workerID: {
        type: String,
        required: true
    },  
    type: {
        type: String,
        enum: ["Normal", "Warning", "Danger"],
        required: true
    },

    // 🔥 ADD THESE
    hazardType: {
        type: String,
        enum: ["gas", "temperature", "flame"]
    },

    zone: {
        type: String
    },

    message: String,
    temperature: Number,
    gasLevel: Number,
    flameDetected: Boolean,

    location: {
        latitude: Number,
        longitude: Number
    },

    date: {
        type: Date,
        default: Date.now
    },

    factory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Factory",
        required: true
    },
    
    isResolved: {
      type: Boolean,
      default: false
    }
  });

module.exports = mongoose.model("Alert", alertSchema);