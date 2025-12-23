const CustomError = require("../responses/customError");
const usersService = require("../services/users.service");

exports.getMe = async (req, res, next) => {
    if (!req.user || !req.user.id) {
        return next(new CustomError("UNAUTHORIZED", "No authroization information", 401));
    }

    try {
        const user = await usersService.getMe(req.user.id);
        return res.status(200).json(user);
    } catch (err) {
        return next(err);
    }
};