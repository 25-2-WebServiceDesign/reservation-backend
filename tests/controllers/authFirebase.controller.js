const CustomError = require('../responses/customError')
const ApiResponse = require('../responses/ApiResponse');

const AuthService = require("../services/auth.service")

module.exports = {
    async googleLogin(req, res, next) {
        // input validation
        const { idToken } = req.body

        if (!idToken) {
            const err = new CustomError("BAD_REQUEST", "idToken is required", 400);
            next(err);
        }


        // processing
        try {
            const data = await AuthService.googleLogin(idToken)
            // res.status(200).json({message: "ok"})
            res.status(200).json(new ApiResponse(data))
        } catch(err) {
            next(err)
        }
    },

}