const express = require("express");
const router = express.Router();

const validate = require("../Middlewares/ValidateMiddleware.js");
const { doctorSchema } = require("../Utils/Validation.js");
const authMiddleware = require("../Middlewares/AuthMiddleware.js");
const doctorController = require("../Controllers/doctorController.js")


router.post("/", authMiddleware(["ADMIN"]), validate(doctorSchema),doctorController.createDoctor);
router.get("/", doctorController.getAllDoctors);
router.get("/:id", doctorController.getDoctorsById);
router.put("/:id", authMiddleware(["ADMIN"]), validate(doctorSchema),doctorController.UpdateDoctor);
router.delete("/:id", authMiddleware(["ADMIN"]),doctorController.deleteDoctor)
router.get("/:id/availability",doctorController.getDoctorAvailability);

module.exports = router;
