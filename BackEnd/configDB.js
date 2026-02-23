const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        require("dotenv").config();
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Atlas Connected");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;