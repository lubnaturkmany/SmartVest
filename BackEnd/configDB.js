require("dotenv").config(); 
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("Mongo URI is not defined in .env");

    await mongoose.connect(uri);
    console.log("✅ MongoDB Atlas Connected");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;