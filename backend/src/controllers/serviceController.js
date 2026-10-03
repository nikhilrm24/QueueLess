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
const updateService = async (req, res, next) => {
    try {
        const {
            name,
            description,
            averageServiceTime,
            isActive
        } = req.body;

        const service = await serviceModel.updateService(
            req.params.id,
            name,
            description,
            averageServiceTime,
            isActive
        );

        if (!service) {
            throw new AppError("Service not found", 404);
        }

        res.status(200).json({
            success: true,
            data: service
        });
    } catch (error) {
        next(error);
    }
};

const deleteService = async (req, res, next) => {
    try {
        const service = await serviceModel.deleteService(
            req.params.id
        );

        if (!service) {
            throw new AppError("Service not found", 404);
        }

        res.status(200).json({
            success: true,
            message: "Service deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};
module.exports = {
    createService,
    getServices,
    updateService,
    deleteService
};