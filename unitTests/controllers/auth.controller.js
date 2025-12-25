const CustomError = require("../responses/customError");
const ApiResponse = require("../responses/ApiResponse");

const AuthService = require("../services/auth.service");

module.exports = {
    async refresh(req, res, next) {
        // input validation
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return next(new CustomError("BAD_REQUEST", "refreshToken is required", 400));
        }

        // process
        try {
            const data = await AuthService.refresh(refreshToken);
            res.status(200).json(new ApiResponse(data));
        } catch(err) {
            next(err)
        }
    },

    async logout(req, res, next) {
        // input validation
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return next(new CustomError("BAD_REQUEST", "refreshToken is required", 400));
        }

        // process
        try {
            const data = await AuthService.logout(refreshToken);
            res.status(200).json(new ApiResponse(data));
        } catch(err) {
            next(err)
        }
    }
}