const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((error) => error.message)
      .join(", ");
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID";
  }

  if (err.code === 11000) {
    statusCode = 409;
    const fields = Object.keys(err.keyPattern || {});
    message = fields.length
      ? `Duplicate value for: ${fields.join(", ")}`
      : "Duplicate key error";
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token has expired";
  }

  if (
    err.name === "SyntaxError" &&
    err.type === "entity.parse.failed"
  ) {
    statusCode = 400;
    message = "Invalid JSON";
  }

  if (err.name === "MongoServerError" && err.code !== 11000) {
    statusCode = 500;
    message = "Database error";
  }

  if (statusCode >= 500 && !err.isOperational) {
    message = "Internal Server Error";
  }

  res.status(statusCode).json({
    status: statusCode >= 500 ? "error" : "fail",
    message,
  });
};

module.exports = errorHandler;