const express = require('express');
const router = express.Router();
const validate = require("../Middlewares/ValidateMiddleware.js");
const { patientSchema } = require("../Utils/Validation.js");
const authMiddleware = require("../Middlewares/AuthMiddleware.js");
const patientController = require("../Controllers/patientController.js")

router.post("/",authMiddleware(["ADMIN"]),validate(patientSchema),patientController.createPatient);
router.get("/",authMiddleware(["ADMIN"]),patientController.getAllpatients);
router.get("/:id",authMiddleware(["ADMIN","PATIENT"]),patientController.getPatientById);
router.put("/:id", authMiddleware(["ADMIN", "PATIENT"]), validate(patientSchema),patientController.updatePatient);
router.delete("/:id", authMiddleware(["ADMIN"]),patientController.deletePatient);

module.exports = router;