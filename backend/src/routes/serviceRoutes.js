const express = require("express");
const router = express.Router();
const {
    createService,
    getServices,
    updateService,
    deleteService
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

router.patch(
    "/services/:id",
    verifyToken,
    authorizeRoles("BUSINESS_OWNER"),
    updateService
);

router.delete(
    "/services/:id",
    verifyToken,
    authorizeRoles("BUSINESS_OWNER"),
    deleteService
);

module.exports = router;