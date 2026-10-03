const express = require("express");
const router = express.Router();

const {
    createQueue,
    getQueue,
    joinQueue,nextCustomer,completeCustomer
    ,skipCustomer,getQueueStatus,cancelEntry,getMyEntry,getQueueEvents
} = require("../controllers/queueController");

const {
    verifyToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

router.post(
    "/services/:serviceId/queues",
    verifyToken,
    authorizeRoles("BUSINESS_OWNER"),
    createQueue
);

router.get(
    "/queues/:id",
    verifyToken,
    getQueue
);
router.post(
    "/queues/:id/join",
    verifyToken,
    joinQueue
);
router.post(
    "/queues/:id/next",
    verifyToken,
    authorizeRoles("BUSINESS_OWNER"),
    nextCustomer
);
router.post(
    "/queues/:id/complete/:entryId",
    verifyToken,
    authorizeRoles("BUSINESS_OWNER"),
    completeCustomer
);
router.post(
    "/queues/:id/skip/:entryId",
    verifyToken,
    authorizeRoles("BUSINESS_OWNER"),
    skipCustomer
);
router.get(
    "/queues/:id/status",
    verifyToken,
    getQueueStatus
);
router.post(
    "/queues/:id/cancel/:entryId",
    verifyToken,
    cancelEntry
);
router.get(
    "/queues/:id/my-entry",
    verifyToken,
    getMyEntry
);
router.get(
    "/queues/:id/events",
    verifyToken,
    getQueueEvents
);
module.exports = router;