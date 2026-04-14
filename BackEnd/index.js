const connectDB = require("./configDB");
const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors"); 
require("dotenv").config({ path: "../.env" });

const app = express();

// paths
const publicDir = path.join(__dirname, "../FrontEnd/dist");
const indexFile = path.join(publicDir, "index.html");

// middleware
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));
app.use(express.json());

// static files
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
}

// DB
connectDB();

// rate limit
const rateLimit = require("express-rate-limit");

const sensorLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
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

app.use("/api/sensor-data", sensorLimiter, sensorRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/factories", factoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", authRoutes);

// test route 
app.get("/test", (req, res) => {
  res.json({ message: "SmartVest backend is running" });
});

app.get(/.*/, (req, res) => {
  res.sendFile(indexFile);
});

// start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});