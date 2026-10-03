const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AppError("Authentication required", 401);
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return next(new AppError("Token expired", 401));
        }

        if (error.name === "JsonWebTokenError") {
            return next(new AppError("Invalid token", 401));
        }

        next(error);
    }
};

module.exports = {
    verifyToken
};