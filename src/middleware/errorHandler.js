
module.exports = (err, req, res, next) => {
    let status = err.statusCode || 500;
    let name = err.name || "INTERNAL_SERVER_ERROR";
    let message = err.message || "Internal Server Error";

    if (message === "SequelizeValidationError") {
        status = 400;
        name = "VALIDATION_ERROR";
    }

    res.status(status).json({
        error: name,
        message: message
    })
}