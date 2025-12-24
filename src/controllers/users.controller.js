const CustomError = require("../responses/customError");
const ApiResponse = require("../responses/ApiResponse");

const usersService = require("../services/users.service");

exports.getMe = async (req, res, next) => {
    if (!req.user || !req.user.id) {
        return next(new CustomError("UNAUTHORIZED", "No authorization information", 401));
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
        next(new CustomError("UNAUTHORIZED", "No authorization information", 401));
    }

    const userId = req.params.id;

    if (!userId || userId === 0) {
        return next(new CustomError("BAD_REQUEST", "path parameter 'id' is required", 400));
    }

    try {
        const user = await usersService.getById(userId);
        return res.status(200).json(user);
    } catch(err) {
        return next(err);
    }
}
<<<<<<< HEAD
exports.updateMe = async (req, res, next) => {
  if (!req.user || !req.user.id) {
    return next(new CustomError("UNAUTHORIZED", "No authorization information", 401));
  }

  const { nickname, phone, profileImage } = req.body || {};
  const hasAny =
    nickname !== undefined || phone !== undefined || profileImage !== undefined;

  if (!hasAny) {
    return next(new CustomError("BAD_REQUEST", "nothing to update", 400));
  }

  try {
    const updated = await usersService.updateMe(req.user.id, {
      nickname,
      phone,
      profileImage,
    });
    return res.status(200).json(updated);
  } catch (err) {
    return next(err);
  }
};
=======

exports.update = async (req, res, next) => {
    if (!req.user || !req.user.id) {
        next(new CustomError("UNAUTHORIZED", "No authorization information", 401));
    }

    const newData = req.body;
    const keys = Object.keys(newData);

    if (keys.includes("email") || keys.includes("role")) {
        next(new CustomError("FORBIDDEN", "email and role cannot be changed"));
    }

    try {
        const updatedUser = await usersService.update(req.user.id, newData);
        res.status(200).json(new ApiResponse({user: updatedUser}));
    } catch(err) {
        next(err);
    }
}
>>>>>>> 247d730 (feat: update users)
