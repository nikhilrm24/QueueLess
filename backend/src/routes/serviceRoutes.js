const express = require("express");
const router = express.Router();

const {
    createService,
    getServices
} = require("../controllers/serviceController");

const {
    verifyToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

router.post(
    "/businesses/:id/services",
    verifyToken,
    authorizeRoles("BUSINESS_OWNER"),
    createService
);

router.get(
    "/businesses/:id/services",
    verifyToken,
    getServices
);

module.exports = router;