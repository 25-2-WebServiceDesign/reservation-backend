const CustomError = require("./customError");

class AppError extends CustomError {
    constructor(name, statusCode, message) {
        super(name, message, statusCode);
    }
}

module.exports = AppError;