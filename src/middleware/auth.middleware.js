const CustomError = require("../responses/customError")
const jwtUtils = require("../utils/jwt.util");

module.exports = {
    authenticate(req, res, next) {
        const authHeader = req.get("Authorization");

        if(!authHeader) {
            return next(new CustomError("UNAUTHORIZED", "Authorization header is required", 401));
        }

        const token = authHeader.split(' ')[1];
        if(!token) {
            return next(new CustomError("UNAUTHORIZED", "No JWT token", 401));
        }

        try {
            const decoded = jwtUtils.verifyAccessToken(token);
            req.user = decoded;
            return next();
        } catch(err) {
            return next(new CustomError("UNAUTHORIZED", "JWT token is invalid", 401));
        }
    },

    authenticateRole(allowedRoles = []) {
        return (req, res, next) => {
            if (!req.user) {
                return next(new CustomError("UNAUTHORIZED", "No authorization infomation", 401));
            }

            if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) {
                return next();
            }

            const userRole = req.user.role;

            if (!userRole) {
                return next(new CustomError("FORBIDDEN", "No user role information", 403));
            }
            
            if (!allowedRoles.includes(userRole)) {
                return next(new CustomError("FORBIDDEN", "No permission to access", 403));
            }

            return next();
        }
    }
}