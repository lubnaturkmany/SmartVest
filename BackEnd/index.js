const connectDB = require("./configDB");
const express = require("express");
const path = require("path");
require("dotenv").config();
const app = express();

// middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend/public")));

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
//const verifyApiKey = require("./middleware/apiKeyMiddleware");

app.use("/api/sensor-data", sensorLimiter, sensorRoutes);
//app.use("/api/auth/login", authLimiter, authRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/factories", factoryRoutes);
app.use("/api/auth", authRoutes);

// test route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../FrontEnd/public/index.html"));
});

// start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});