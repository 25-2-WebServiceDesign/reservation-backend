const CustomError = require("../responses/customError")

module.exports = {
    async getMyDetail(req, res, next) {
        // input validation
        const userId = req.user.id;

        if (!userId) {
            next(new CustomError("UNAUTHORIZED", "No authorization information", 401));
        }

        
    },

    async getDetailById(req, res, next) {

    }
}