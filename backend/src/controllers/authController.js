
const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");
const AppError = require("../utils/AppError");

const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            throw new AppError(
                "Name, email and password are required",
                400
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.createUser(
            name,
            email,
            hashedPassword,
            role || "CUSTOMER"
        );

        res.status(201).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};
module.exports = {
    register
};