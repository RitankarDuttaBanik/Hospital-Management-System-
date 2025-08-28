const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const prisma = require("../Config/Db.js");
const logger = require("../Utils/Logger.js");

exports.register = async (req,res,next) => {
    try {
        const { email,password,role } = req.body;
        

        const existUser = await prisma.user.findUnique({ where : {email : req.body.email}});
        if(existUser){
            logger.warn({email : req.body.email }, "🚫 User already exists");
             return res.status(409).json({ error: "User already exists" });
        }

        const HashPassword = await bcrypt.hash(password,10);

        const user = await prisma.user.create({
            data : {email,
                password: HashPassword,
                role : role.toUpperCase(),
                
            }
          });

        logger.info({ userId: user.id, role: user.role }, "✅ User registered");
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        next(error);
    }
};
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      logger.warn({ email }, "🚫 User not found");
      return res.status(401).json({ error: "Invalid credentials" }); // use 401 for auth errors
    }

   
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.warn({ email }, "🚫 Wrong password");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    logger.info({ userId: user.id }, "✅ User logged in");

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    logger.error(error, "❌ Login failed");
    next(error);
  }
};
