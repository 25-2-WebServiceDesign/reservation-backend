module.exports = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let code = err.name || "INTERNAL_SERVER_ERROR";
  let message = err.message || "Internal Server Error";
  let details = err.details;

  if (err?.name === "SequelizeValidationError") {
    status = 400;
    code = "VALIDATION_FAILED";
    message = "Validation failed";
    details = err.errors?.map((e) => ({ field: e.path, message: e.message })) || undefined;
  }

  if (err?.name === "SequelizeUniqueConstraintError") {
    status = 409;
    code = "DUPLICATE_RESOURCE";
    message = "Duplicate resource";
    details = err.errors?.map((e) => ({ field: e.path, message: e.message })) || undefined;
  }

  if (err?.name === "SequelizeForeignKeyConstraintError") {
    status = 409;
    code = "STATE_CONFLICT";
    message = "Foreign key constraint failed";
  }

  return res.status(status).json({
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    status,
    code,
    message,
    details,
    error: code,
  });
};
