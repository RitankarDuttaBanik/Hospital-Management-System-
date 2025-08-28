const jwt  = require('jsonwebtoken')
require("dotenv").config();
const logger = require('../Utils/Logger.js');

const authMiddleware = (roles = []) => {
        return (req,res,next) => {
            const authHeader = req.headers.authorization;

            if(!authHeader || !authHeader.startsWith("Bearer ")){
                logger.warn({ url: req.originalUrl, method: req.method }, "🚫 No token provided");
                return res.status(401).json({
                    error : "Token not found"
                });

            }
            const token = authHeader.split(" ")[1];

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = decoded;

                if (roles.length && !roles.includes(decoded.role)) {
                    logger.warn(
                            { url: req.originalUrl, user: decoded },
                            "🚫 Forbidden: insufficient rights"
                             );
                    return res.status(403).json({ error: "Forbidden: insufficient rights" });
             }

                next();
            } catch (error) {
                logger.error(
                { url: req.originalUrl, error: error.message },
                 "❌ Invalid or expired token"
                );
                return res.status(401).json({
                    error : 'Invalid or expired token'
                });
            }
        }
}

module.exports = authMiddleware;