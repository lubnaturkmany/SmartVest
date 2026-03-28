const connectDB = require("./configDB");
const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors"); 
require("dotenv").config({ path: "../.env" });
const app = express();

const publicDir = path.join(__dirname, "../FrontEnd/dist");
//const setPasswordFile = path.join(__dirname, "../FrontEnd/public/change-password.html");
const indexFile = path.join(publicDir, "index.html");

app.get("*", (req, res) => {
  res.sendFile(indexFile); // index.html الخاص بالـ React app
})

// test route
app.get("/", (req, res) => {
  if (!fs.existsSync(indexFile)) {
    return res.json({ message: "SmartVest backend is running" });
  }
  res.sendFile(indexFile);
});

// middleware
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));
app.use(express.json());
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
}

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


// start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});