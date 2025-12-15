
class CustomError extends Error {
    constructor(name, message, statusCode) {
        super(message);
        this.name = name
        this.statusCode = statusCode
    }

    response() {
        return {
            message: this.name,
            detail: this.message
        }
    }
}

module.exports = CustomError;