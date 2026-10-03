const express = require("express");
const router = express.Router();

const {
    createQueue,
    getQueue
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

module.exports = router;