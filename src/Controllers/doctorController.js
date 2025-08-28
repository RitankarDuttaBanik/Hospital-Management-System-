const prisma = require("../Config/Db.js");
const logger = require("../Utils/Logger.js");
const { startOfDay, endOfDay } = require("date-fns");

exports.createDoctor = async (req,res,next) => {
    try {
        const doctor = await prisma.doctor.create({ data : req.body});
        logger.info({ doctorId: doctor.id }, "✅ Doctor created");
        res.status(201).json(doctor);

    } catch (error) {
        next(error);
    }
};

exports.getAllDoctors = async (req,res,next) => {
    try {
        const { page=1,limit=10,search } = req.query;
        const skip = (page - 1)*limit;

        const where = search
        ? {
            OR: [
                {fullName : {contains : search , mode : "insensitive"}  },
                { speciality: { contains: search, mode: "insensitive" } }
            ]
        }
        : {};

        const doctors = await prisma.doctor.findMany({
            where,
            skip: Number(skip),
            take: Number(limit),
            orderBy: { createdAt: "desc" }
        });
            logger.info({ count: doctors.length }, "📋 Doctors fetched");
            res.json(doctors);
    } catch (error) {
        next(error);
    }
};

exports.getDoctorsById = async (req,res,next) => {
    try {
    const doctor = await prisma.doctor.findUnique({ where: { id: Number(req.params.id) } });
    if (!doctor) {
      logger.warn({ doctorId: req.params.id }, "🚫 Doctor not found");
      return res.status(404).json({ error: "Doctor not found" });
    }
    res.json(doctor);
  } catch (err) {
    next(err);
  }
};

exports.UpdateDoctor = async (req,res,next) => {
    try {
        const doctor = await prisma.doctor.update({
            where : {
                id : Number(req.params.id)
            },
            data : req.body
        });

        logger.info({ doctorId: doctor.id }, "✏️ Doctor updated");
        res.json(doctor);

    } catch (error) {
        next(error);
    }
};

exports.deleteDoctor = async (req, res, next) => {
  try {
    await prisma.doctor.delete({ where: { id: Number(req.params.id) } });
    logger.info({ doctorId: req.params.id }, "🗑️ Doctor deleted");
    res.json({ message: "Doctor deleted" });
  } catch (err) {
    next(err);
  }
};
//important
exports.getDoctorAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: "Date query param is required" });
    }

    const doctor = await prisma.doctor.findUnique({ where: { id: Number(id) } });
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // normalize date range
    const day = new Date(date);
    const start = startOfDay(day);
    const end = endOfDay(day);

    // fetch booked appointments for that day
    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: Number(id),
        startTime: { gte: start, lte: end }
      },
      orderBy: { startTime: "asc" }
    });

    logger.info(`Doctor ${id} availability checked for ${date}`);

    res.json({
      doctorId: id,
      date,
      bookedAppointments: appointments
    });
  } catch (err) {
    logger.error("Error fetching doctor availability", { error: err.message });
    next(err);
  }
};

