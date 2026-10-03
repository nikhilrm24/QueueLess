const express = require("express");
const router = express.Router();

const { getUsers } = require("../controllers/userController");
const { verifyToken,authorizeRoles } = require("../middleware/authMiddleware");


router.get("/", verifyToken,getUsers);

router.get(
    "/business-test",
    verifyToken,
    authorizeRoles("BUSINESS_OWNER"),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "Business owner access granted"
        });
    }
);


module.exports = router;