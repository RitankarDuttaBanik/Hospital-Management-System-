const express = require("express");
const router = express.Router();

const appointmentController = require("../Controllers/appointmentController.js");
const validate = require("../Middlewares/ValidateMiddleware.js");
const { appointmentSchema } = require("../Utils/Validation.js");
const authMiddleware = require("../Middlewares/AuthMiddleware.js");


router.post("/", authMiddleware(["PATIENT"]), validate(appointmentSchema),appointmentController.createappointment);
router.delete("/:id", authMiddleware(["PATIENT", "ADMIN"]),appointmentController.cancelappointment);
router.get("/", authMiddleware(["ADMIN", "DOCTOR", "PATIENT"]),appointmentController.getAllAppointment);
router.get("/:id", authMiddleware(["ADMIN", "DOCTOR", "PATIENT"]),appointmentController.getAppointmentById);

module.exports = router;


