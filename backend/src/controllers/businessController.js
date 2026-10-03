const businessModel = require("../models/businessModel");
const AppError = require("../utils/AppError");

const createBusiness = async (req, res, next) => {
    try {
        const {
            name,
            description,
            address,
            phone
        } = req.body;

        if (!name) {
            throw new AppError("Business name is required", 400);
        }

        const business = await businessModel.createBusiness(
            req.user.id,
            name,
            description,
            address,
            phone
        );

        res.status(201).json({
            success: true,
            data: business
        });
    } catch (error) {
        next(error);
    }
};

const getBusiness = async (req, res, next) => {
    try {
        const business = await businessModel.getBusinessById(
            req.params.id
        );

        if (!business) {
            throw new AppError("Business not found", 404);
        }

        res.status(200).json({
            success: true,
            data: business
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createBusiness,
    getBusiness
};