const express = require("express");
const router = express.Router();

const {
    createBusiness,
    getBusiness
} = require("../controllers/businessController");

const {
    verifyToken,
    authorizeRoles
} = require("../middleware/authMiddleware");



router.post(
    "/",
    verifyToken,
    authorizeRoles("BUSINESS_OWNER"),
    createBusiness
);

router.get(
    "/:id",
    verifyToken,
    getBusiness
);

module.exports = router;