const connectDB = require("./configDB");
const express = require("express");
require("dotenv").config();
const app = express();

// middleware
app.use(express.json());

//DB
connectDB();

const rateLimit = require("express-rate-limit");
//  spam الحماية من 
const sensorLimiter = rateLimit({
  windowMs: 60 * 1000, // دقيقة
  max: 100, // 100 request بالدقيقة
  message: "Too many sensor requests. Try again later."
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts. Try again later."
});

// routes
const sensorRoutes = require("./routes/sensorRoutes");
const alertRoutes = require("./routes/alertRoutes");
const workerRoutes = require("./routes/workerRoutes");
const authRoutes = require("./routes/authRoutes");
const factoryRoutes = require("./routes/factoryRoutes");

app.use("/api/sensor-data", sensorLimiter, verifyFactoryApiKey, sensorRoutes);
app.use("/api/auth/login", authLimiter);
app.use("/api/alerts", alertRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/auth", authRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Smart Vest API is running");
});

// start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});