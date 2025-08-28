const logger = require("../Utils/Logger.js");

//global middleware
function errorMiddleware(err, req, res, next) {
  
  logger.error({
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    params: req.params,
    query: req.query,
    stack: err.stack
  }, "🔥 Error occurred");

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
}

module.exports = errorMiddleware;
