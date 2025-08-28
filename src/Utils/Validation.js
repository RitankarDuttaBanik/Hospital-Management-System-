const joi = require('joi');

const registerSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    role: joi.string().valid("PATIENT", "DOCTOR", "ADMIN").required()
});

const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required()
});

const patientSchema = joi.object({
  fullName: joi.string().min(3).max(100).required(),
  age: joi.number().integer().min(0).max(120).required(),
  gender: joi.string().valid("male", "female", "other").required(),
  contactNumber: joi.string().pattern(/^[0-9]{10}$/).required(),
  userId: joi.string().uuid().required()  // ✅ allow userId
});

const doctorSchema = joi.object({
  fullName: joi.string().min(3).max(100).required(),
  speciality: joi.string().required(),
  workStart: joi.string().pattern(/^\d{2}:\d{2}$/).required(), // HH:mm // 
  workEnd: joi.string().pattern(/^\d{2}:\d{2}$/).required(),
  slotMinutes: joi.number().integer().valid(15, 30, 45, 60).default(30),
  userId: joi.string().uuid().required() 
});

const appointmentSchema = joi.object({
  doctorId: joi.string().uuid().required(),
  patientId: joi.string().uuid().required(),
  startTime: joi.date().greater("now").required(),
  endTime: joi.date().greater(joi.ref("startTime")).required(),
  reason: joi.string().allow("").optional(),
  
});

module.exports = {
  registerSchema,
  loginSchema,
  patientSchema,
  doctorSchema,
  appointmentSchema
};