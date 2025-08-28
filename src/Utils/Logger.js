const pino = require('pino')
require("dotenv").config();

const logger = pino({
    transport : {
        target : "pino-pretty",
        options : {
            colorize : true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname" // Remove extra noise
        }
    },
    level: process.env.NODE_ENV === "production" ? "info" : "debug"
});

module.exports = logger;