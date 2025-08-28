const prisma = require("../Config/Db.js");
const logger = require("../Utils/Logger.js");

exports.createappointment = async (req, res, next) => {
  try {
    const { doctorId, patientId, startTime, endTime, reason } = req.body;

    // ✅ Ensure doctor exists
    const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!doctor) {
      logger.warn({ doctorId }, "🚫 Doctor not found");
      return res.status(400).json({ error: "Doctor not found" });
    }

    // ✅ Ensure patient exists
    const patient = await prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) {
      logger.warn({ patientId }, "🚫 Patient not found");
      return res.status(400).json({ error: "Patient not found" });
    }

    // ✅ Prevent overlapping appointments for the doctor
    const overlapping = await prisma.appointment.findFirst({
      where: {
        doctorId,
        OR: [
          {
            startTime: { lt: new Date(endTime) },
            endTime: { gt: new Date(startTime) }
          }
        ]
      }
    });

    if (overlapping) {
      logger.warn(
        { doctorId, startTime, endTime },
        "🚫 Appointment conflict detected"
      );
      return res.status(400).json({
        error: "Doctor already has an appointment in this time slot"
      });
    }

    // ✅ Create the appointment
    const appointment = await prisma.appointment.create({
      data: {
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        reason,
        doctor: { connect: { id: doctorId } },
        patient: { connect: { id: patientId } }
      }
    });

    logger.info(
      { appointmentId: appointment.id, doctorId, patientId },
      "✅ Appointment created successfully"
    );

    res.status(201).json(appointment);
  } catch (error) {
    logger.error(
      { error: error.message, body: req.body },
      "❌ Failed to create appointment"
    );
    next(error);
  }
};

exports.cancelappointment = async (req,res,next) => {
    try {
        await prisma.appointment.delete({where : {id : Number(req.params.id)}});
        logger.info({ appointmentId: req.params.id }, "🗑️ Appointment cancelled");
        res.json({ message: "Appointment cancelled" });
    } catch (error) {
        next(error);
    }
};

exports.getAllAppointment = async (req,res,next) => {
    try {
        const { page=1,limit=10,sort="startTime",order="asc"} = req.query;
        const skip = (page - 1)*limit;

        const appointments = await prisma.appointment.findMany({
            skip : Number(skip),
            take : Number(limit),
            orderBy : {[sort] : order },
            include : {doctor : true , patient : true }
        });

        logger.info({
            count : appointments.length}, "📋 Appointments fetched");
            res.json(appointments);
    } catch (error) {
        next(err);
    }
};

exports.getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: Number(req.params.id) },
      include: { doctor: true, patient: true }
    });

    if (!appointment) {
      logger.warn({ appointmentId: req.params.id }, "🚫 Appointment not found");
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json(appointment);
  } catch (err) {
    next(err);
  }
};

