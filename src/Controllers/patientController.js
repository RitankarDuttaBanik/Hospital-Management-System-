const prisma = require("../Config/Db.js"); 
const logger = require("../Utils/Logger.js");

exports.createPatient = async (req, res, next) => {
  try {
    const { fullName, age, gender, contactNumber, userId } = req.body;

    // ✅ Check if user exists before connect
    const user = await prisma.user.findUnique({ where: { id : userId } });
    if (!user) {
      logger.warn({ userId }, "🚫 Cannot create patient — user not found");
      return res.status(400).json({ error: "User with this email does not exist" });
    }

    const patient = await prisma.patient.create({
      data: {
        fullName,
        age,
        gender,
        contactNumber,
        user: {
          connect: { id : userId } // safe now, since user exists
        }
      }
    });

    logger.info(
      { patientId: patient.id, linked: userId },
      "✅ Patient created successfully"
    );

    res.status(201).json(patient);
  } catch (error) {
    logger.error(
      { error: error.message, body: req.body },
      "❌ Failed to create patient"
    );
    next(error);
  }
};

exports.getAllpatients = async (req,res,next) => {
    try {
        const { page=1,limit=10, search } = req.query;
        const skip = (page - 1)*limit;

        const where = search 
        ? {
            OR:  [
                    { fullName: { contains: search, mode: "insensitive" } },
                    { contactNumber: { contains: search, mode: "insensitive" } }
                ]
        } : {};

        const [patients,total] = await Promise.all([
        await prisma.patient.findMany({
            where,
            skip: Number(skip),
            take: Number(limit),
            orderBy: { createdAt : "desc" }
        }),
            prisma.patient.count({where})
        ]);

        res.json({
            data: patients,
                meta: {
                        total,
                        page: Number(page),
                        limit: Number(limit),
                        totalPages: Math.ceil(total / limit)
                    }
                });
    } catch (error) {
        next(error);
    }
};

exports.getPatientById = async (req,res,next) => {
    try {
        const patient = await prisma.findUnique({where : {id : Number(req.params.id)}});
         if (!patient) {
            logger.warn({ patientId: req.params.id }, "🚫 Patient not found");
            return res.status(404).json({ error: "Patient not found" });
        }
        res.json(patient);
    } catch (error) {
        next(error);
    }
};

exports.deletePatient = async (req,res,next) => {
    try {
        await prisma.patient.delete({where : {id : req.params.id}});
        logger.info({ patientId: req.params.id }, "🗑️ Patient deleted");
        res.json({ message: "Patient deleted" });

    } catch (error) {
        next(error);
    }
}

exports.updatePatient = async (req, res, next) => {
  try {
    const patient = await prisma.patient.update({
      where: { id: Number(req.params.id) },
      data: req.body
    });
    logger.info({ patientId: patient.id }, "✏️ Patient updated");
    res.json(patient);
  } catch (err) {
    next(err);
  }
};
