
const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");
const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");

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
        if (error.code === "23505") {
            return next(new AppError("Email already registered", 409));
        }

        next(error);
    }
};
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new AppError(
                "Email and password are required",
                400
            );
        }

        const user = await userModel.getUserByEmail(
            email.trim().toLowerCase()
        );

        if (!user) {
            throw new AppError("Invalid email or password", 401);
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            throw new AppError("Invalid email or password", 401);
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        );

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token
            }
        });
    } catch (error) {
        next(error);
    }
};
module.exports = {
    register,login
};