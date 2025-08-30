const express = require('express');
const router = express.Router();
const validate = require('../Middlewares/ValidateMiddleware.js');
const { registerSchema,loginSchema } = require('../Utils/Validation.js');
const authController = require('../Controllers/authController.js');

router.post("/register",validate(registerSchema), authController.register);
router.post("/login",validate(loginSchema),authController.login);


module.exports = router;

