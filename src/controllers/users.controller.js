const CustomError = require("../responses/customError");
const usersService = require("../services/users.service");

exports.getMe = async (req, res, next) => {
    if (!req.user || !req.user.id) {
        return next(new CustomError("UNAUTHORIZED", "No authroization information", 401));
    }

    try {
        const user = await usersService.getById(req.user.id);
        return res.status(200).json(user);
    } catch (err) {
        return next(err);
    }
};

exports.getUserById = async (req, res, next) => {
    if (!req.user) {
        return next(new CustomError("UNAUTHORIZED", "No authorization information", 401));
    }

    const userId = req.params.id;

    if (!userId || userId === 0) {
        next(new CustomError("BAD_REQUEST", "path parameter 'id' is required", 400));
    }

    try {
        const user = await usersService.getById(userId);
        return res.status(200).json(user);
    } catch(err) {
        return next(err);
    }
}