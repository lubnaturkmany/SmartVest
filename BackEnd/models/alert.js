const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
    workerID: String,
    type: String,
    message: String,
    temperature: Number,
    gasLevel: Number,
    heartRate: Number,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Alert", alertSchema);