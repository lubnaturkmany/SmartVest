const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema({
  // ID للعامل  
workerID: {
  type: String,
  required: true,
  unique: true,
  trim: true
},
  // الاسم الاول
  firstName: {                  
    type: String,
    required: true
  },
  //اسم الاخير 
   lastName: {
     type: String 
    },
    // العمر
  age: {                    
    type: Number,
    required: true
  },
   // مين الي يستقبل البيانات وايش هما
role: {
  type: String,
  enum: ["Worker", "Supervisor", "Admin"],
  required: true
},
  // موقع العامل
  location: {
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true
  }
},
  // الموقع الأخير للعامل
  lastLocation: {           
    lat: Number,
    lng: Number
  }
  },
  { timestamps: true });

workerSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Worker", workerSchema);

