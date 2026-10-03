const queueModel = require("../models/queueModel");
const AppError = require("../utils/AppError");
const queueEntryModel = require("../models/queueEntryModel");
const serviceModel = require("../models/serviceModel");
const queueEventModel = require("../models/queueEventModel");

// CREATE QUEUE
const createQueue = async (req, res, next) => {
    try {
        const { name, tokenPrefix } = req.body;

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

// GET QUEUE
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

// JOIN QUEUE
const joinQueue = async (req, res, next) => {
    try {
        const queueId = req.params.id;
        const userId = req.user.id;

        // Check queue
        const queue = await queueModel.getQueueById(queueId);

        if (!queue) {
            throw new AppError(
                "Queue not found",
                404
            );
        }

        // Check queue status
        if (queue.status !== "OPEN") {
            throw new AppError(
                "Queue is not open",
                400
            );
        }

        // Prevent duplicate active entry
        const existingEntry =
            await queueEntryModel.getActiveEntryByUser(
                queueId,
                userId
            );

        if (existingEntry) {
            throw new AppError(
                "You are already in this queue",
                409
            );
        }

        // Generate next token
        const updatedQueue =
            await queueEntryModel.incrementQueueToken(
                queueId
            );

        // Get service information
        const service =
            await serviceModel.getServiceById(
                updatedQueue.service_id
            );

        if (!service) {
            throw new AppError(
                "Service not found",
                404
            );
        }

        // Create queue entry
        const entry =
            await queueEntryModel.createQueueEntry(
                queueId,
                userId,
                updatedQueue.current_token
            );
            


        // Record event
        const event=await queueEventModel.createQueueEvent(
            queueId,
            entry.id,
            "USER_JOINED"
        );


        
        const position =
            await queueEntryModel.getQueuePosition(
                queueId,
                entry.token_number
            );

        // Calculate estimated waiting time
        const estimatedWait =
            (position - 1) *
            service.average_service_time;

        res.status(201).json({
            success: true,
            data: {
                entryId: entry.id,
                token: `${updatedQueue.token_prefix}-${entry.token_number}`,
                status: entry.status,
                position,
                estimatedWait
            }
        });
    } catch (error) {
        next(error);
    }
};

// CALL NEXT CUSTOMER
const nextCustomer = async (req, res, next) => {
    try {
        const queueId = req.params.id;

        const queue =
            await queueModel.getQueueById(queueId);

        if (!queue) {
            throw new AppError(
                "Queue not found",
                404
            );
        }

        const entry =
            await queueEntryModel.getNextWaitingEntry(
                queueId
            );

        if (!entry) {
            throw new AppError(
                "No customers waiting in the queue",
                404
            );
        }

        const updatedEntry =
            await queueEntryModel.markEntryAsCalled(
                entry.id
            );

        // Record event
        await queueEventModel.createQueueEvent(
            queueId,
            updatedEntry.id,
            "TOKEN_CALLED"
        );

        res.status(200).json({
            success: true,
            data: {
                entryId: updatedEntry.id,
                token: `${queue.token_prefix}-${updatedEntry.token_number}`,
                status: updatedEntry.status,
                calledAt: updatedEntry.called_at
            }
        });
    } catch (error) {
        next(error);
    }
};

// COMPLETE CUSTOMER
const completeCustomer = async (req, res, next) => {
    try {
        const queueId = req.params.id;
        const entryId = req.params.entryId;

        const entry =
            await queueEntryModel.markEntryAsCompleted(
                entryId
            );

        if (!entry) {
            throw new AppError(
                "Entry not found or customer is not currently called",
                404
            );
        }

        // Record event
        await queueEventModel.createQueueEvent(
            queueId,
            entry.id,
            "TOKEN_COMPLETED"
        );

        res.status(200).json({
            success: true,
            data: {
                entryId: entry.id,
                status: entry.status,
                servedAt: entry.served_at
            }
        });
    } catch (error) {
        next(error);
    }
};

// SKIP CUSTOMER
const skipCustomer = async (req, res, next) => {
    try {
        const queueId = req.params.id;
        const entryId = req.params.entryId;

        const entry =
            await queueEntryModel.markEntryAsSkipped(
                entryId
            );

        if (!entry) {
            throw new AppError(
                "Entry not found or cannot be skipped",
                404
            );
        }

        const queue =
            await queueModel.getQueueById(queueId);

        if (!queue) {
            throw new AppError(
                "Queue not found",
                404
            );
        }

        // Record event
        await queueEventModel.createQueueEvent(
            queueId,
            entry.id,
            "TOKEN_SKIPPED"
        );

        res.status(200).json({
            success: true,
            data: {
                entryId: entry.id,
                token: `${queue.token_prefix}-${entry.token_number}`,
                status: entry.status
            }
        });
    } catch (error) {
        next(error);
    }
};

// GET QUEUE STATUS
const getQueueStatus = async (req, res, next) => {
    try {
        const queueId = req.params.id;

        const queue =
            await queueModel.getQueueById(queueId);

        if (!queue) {
            throw new AppError(
                "Queue not found",
                404
            );
        }

        const entries =
            await queueEntryModel.getQueueEntries(
                queueId
            );

        const waitingEntries = entries.filter(
            (entry) =>
                entry.status === "WAITING"
        );

        const calledEntry = entries.find(
            (entry) =>
                entry.status === "CALLED"
        );

        res.status(200).json({
            success: true,
            data: {
                queue: {
                    id: queue.id,
                    name: queue.name,
                    status: queue.status
                },
                currentToken: calledEntry
                    ? `${queue.token_prefix}-${calledEntry.token_number}`
                    : null,
                waitingCount:
                    waitingEntries.length,
                entries
            }
        });
    } catch (error) {
        next(error);
    }
};

// CANCEL QUEUE ENTRY
const cancelEntry = async (req, res, next) => {
    try {
        const queueId = req.params.id;
        const entryId = req.params.entryId;
        const userId = req.user.id;

        // Make sure entry belongs to logged-in user
        const entry =
            await queueEntryModel.getActiveEntryByUser(
                queueId,
                userId
            );

        if (
            !entry ||
            entry.id !== Number(entryId)
        ) {
            throw new AppError(
                "Queue entry not found",
                404
            );
        }

        const cancelledEntry =
            await queueEntryModel.markEntryAsCancelled(
                entryId
            );

        if (!cancelledEntry) {
            throw new AppError(
                "Only waiting entries can be cancelled",
                400
            );
        }

        // Record event
        await queueEventModel.createQueueEvent(
            queueId,
            cancelledEntry.id,
            "TOKEN_CANCELLED"
        );

        res.status(200).json({
            success: true,
            data: {
                entryId: cancelledEntry.id,
                token: cancelledEntry.token_number,
                status: cancelledEntry.status
            }
        });
    } catch (error) {
        next(error);
    }
};

// GET MY QUEUE ENTRY
const getMyEntry = async (req, res, next) => {
    try {
        const queueId = req.params.id;
        const userId = req.user.id;

        const entry =
            await queueEntryModel.getActiveEntryDetails(
                queueId,
                userId
            );

        if (!entry) {
            throw new AppError(
                "You are not currently in this queue",
                404
            );
        }

        let position = null;
        let estimatedWait = null;

        if (entry.status === "WAITING") {
            position =
                await queueEntryModel.getQueuePosition(
                    queueId,
                    entry.token_number
                );

            estimatedWait =
                (position - 1) *
                entry.average_service_time;
        }

        res.status(200).json({
            success: true,
            data: {
                entryId: entry.id,
                token: `${entry.token_prefix}-${entry.token_number}`,
                status: entry.status,
                position,
                estimatedWait,
                joinedAt: entry.joined_at,
                calledAt: entry.called_at
            }
        });
    } catch (error) {
        next(error);
    }
};

const getQueueEvents = async (req, res, next) => {
    try {
        const queueId = req.params.id;

        const queue =
            await queueModel.getQueueById(queueId);

        if (!queue) {
            throw new AppError(
                "Queue not found",
                404
            );
        }

        const events =
            await queueEventModel.getQueueEvents(
                queueId
            );

        res.status(200).json({
            success: true,
            data: events
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createQueue,
    getQueue,
    joinQueue,
    nextCustomer,
    completeCustomer,
    skipCustomer,
    getQueueStatus,
    cancelEntry,
    getMyEntry,
    getQueueEvents
};