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
};

exports.updateMe = async (req, res, next) => {
  if (!req.user || !req.user.id) {
    next(new CustomError("UNAUTHORIZED", "No authorization information", 401));
  }
  
  // email, role 은 변경 불가능
  if (Object.keys(req.body).includes("email") || Object.keys(req.body).includes("role")) {
    next(new CustomError("FORBIDDEN", "email and role cannot be changed"));
  }

  const { nickname, phone, profileImage } = req.body || {};
  const hasAny =
    nickname !== undefined || phone !== undefined || profileImage !== undefined;

  if (!hasAny) {
    next(new CustomError("BAD_REQUEST", "nothing to update", 400));
  }

  try {
    const updated = await usersService.updateMe(req.user.id, {
      nickname,
      phone,
      profileImage,
    });
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

exports.deleteMe = async (req, res, next) => {
  // input validation
  if (!req.user || !req.user.id) {
    next(new CustomError("UNAUTHORIZED", "No authorization information", 401));
  }

  // 관리자는 제거 불가능 넣을까 말까..
  
  // processing
  try {
    const data = await usersService.deleteMe(req.user.id);
    res.status(200).json(new ApiResponse(data));
  } catch(err) {
    next(err);
  }
};

exports.changeRole = async (req, res, next) => {
  // input validation
  // 이미 관리자 인증 완료 상태
  const userId = Number(req.params.id);
  const newRole = req.body?.role;

  if (!Number.isInteger(userId) || userId <= 0) {
    next(new CustomError("BAD_REQUEST", "unsupported userId format", 400));
  }

  if (!newRole) {
    next(new CustomError("BAD_REQUEST", "role is not contained in the request body", 400));
  }

  const supportedRole = ["CUSTOMER", "OWNER"];
  if (!supportedRole.includes(newRole)) {
    next(new CustomError("BAD_REQUEST", `unsupported role (supported roles: ${supportedRole})`, 400));
  }

  // processing
  try {
    const data = await usersService.changeRole(userId, newRole);
    res.status(200).json(new ApiResponse(data));
  } catch(err) {
    next(err);
  }
}

exports.getMyReviews = async (req, res, next) => {
  // input validation
  if (!req.user || !req.user.id) {
    next(new CustomError("UNAUTHORIZED", "No authorization information", 401));
  }

  const page = req.query.page || 1
  const limit = req.query.limit || 10
  console.log(page, limit);


  // processing
  try {
    const {data, totalCount, totalPage} = await usersService.getReviews(req.user.id, page, limit);
    res.status(200).json(new ApiResponse(data, {
      page,
      limit,
      totalCount,
      totalPage,
    }))
  } catch(err) {
    next(err);
  }
};

exports.getMyFavorites = async (req, res, next) => {
  if (!req.user || !req.user.id) {
    return next(new CustomError("UNAUTHORIZED", "No authorization information", 401));
  }

  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 10);
  const order = String(req.query.order ?? "desc").toLowerCase(); // asc/desc

  try {
    const { data, totalCount, totalPage } = await usersService.getFavorites(req.user.id, {
      page,
      limit,
      order,
    });

    return res.status(200).json(
      new ApiResponse(data, {
        page,
        limit,
        totalCount,
        totalPage,
      })
    );
  } catch (err) {
    return next(err);
  }
};