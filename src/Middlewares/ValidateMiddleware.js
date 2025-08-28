const logger = require("../Utils/Logger.js");

const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });
    if (error) {
      logger.warn(
        {
          url: req.originalUrl,
          method: req.method,
          errors: error.details.map(d => d.message)
        },
        "⚠️ Validation failed"
      );

      return res.status(400).json({
        error: error.details.map(d => d.message),
      });
    }
    next();
  };
};

module.exports = validate;
