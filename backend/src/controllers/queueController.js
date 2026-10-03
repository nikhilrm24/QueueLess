const queueModel = require("../models/queueModel");
const AppError = require("../utils/AppError");

const createQueue = async (req, res, next) => {
    try {
        const {
            name,
            tokenPrefix
        } = req.body;

        if (!name) {
            throw new AppError(
                "Queue name is required",
                400
            );
        }

        const queue = await queueModel.createQueue(
            req.params.serviceId,
            name,
            tokenPrefix
        );

        res.status(201).json({
            success: true,
            data: queue
        });
    } catch (error) {
        next(error);
    }
};

const getQueue = async (req, res, next) => {
    try {
        const queue = await queueModel.getQueueById(
            req.params.id
        );

        if (!queue) {
            throw new AppError(
                "Queue not found",
                404
            );
        }

        res.status(200).json({
            success: true,
            data: queue
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createQueue,
    getQueue
};