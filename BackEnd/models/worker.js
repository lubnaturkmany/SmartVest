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
   // المسمى الوظيفي
  jobTitle: {              
    type: String,
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
  },
  // وقت إضافة العامل
  createdAt: {              
    type: Date,
    default: Date.now
  },
  // وقت آخر تحديث للموقع أو البيانات
  updatedAt: {              
    type: Date,
    default: Date.now
  }
});
workerSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Worker", workerSchema);

