require("dotenv").config();
const express = require("express");
const cors = require("cors");
const logger = require("./Utils/Logger.js");

const authRoutes = require("./Routes/authRoutes.js");
const appointmentRoutes = require("./Routes/appointmentRoutes.js");
const doctorRoutes = require("./Routes/doctorRoutes.js");
const patientRoutes = require("./Routes/patientRoutes.js");

const app = express();
const Port = process.env.PORT || 3030;


app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true
}));

app.use(express.json({ limit: process.env.JSON_LIMIT || "1mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);

app.listen(Port, () => {
  try {
    logger.info(`🚀 Server running on http://localhost:${Port}`);
    logger.info(`🌍 CORS Origin: ${process.env.CORS_ORIGIN || "*"}`);
    logger.info(`📦 JSON Limit: ${process.env.JSON_LIMIT || "1mb"}`);
  } catch (err) {
    logger.error("❌ Server failed to start", err);
  }
});