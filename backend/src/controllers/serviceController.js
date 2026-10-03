const serviceModel = require("../models/serviceModel");
const AppError = require("../utils/AppError");

const createService = async (req, res, next) => {
    try {
        const { name, description, averageServiceTime } = req.body;

        if (!name) {
            throw new AppError("Service name is required", 400);
        }

        const service = await serviceModel.createService(
            req.params.id,
            name,
            description,
            averageServiceTime || 10
        );

        res.status(201).json({
            success: true,
            data: service
        });
    } catch (error) {
        next(error);
    }
};

const getServices = async (req, res, next) => {
    try {
        const services =
            await serviceModel.getServicesByBusinessId(
                req.params.id
            );

        res.status(200).json({
            success: true,
            data: services
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createService,
    getServices
};