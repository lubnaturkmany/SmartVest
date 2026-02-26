const connectDB = require("./configDB");
const express = require("express");
require("dotenv").config();
const app = express();

// middleware
app.use(express.json());

//DB
connectDB();

// routes
const sensorRoutes = require("./routes/sensorRoutes");
const alertRoutes = require("./routes/alertRoutes");
const workerRoutes = require("./routes/workerRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/api", sensorRoutes);
app.use("/api", alertRoutes);
app.use("/api", workerRoutes);
app.use("/api", authRoutes);
// test route
app.get("/", (req, res) => {
  res.send("Smart Vest API is running");
});

// start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});