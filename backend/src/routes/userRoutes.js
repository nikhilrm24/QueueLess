const express = require("express");
const router = express.Router();

const { getUsers } = require("../controllers/userController");
const { verifyToken,authorizeRoles } = require("../middleware/authMiddleware");


router.get("/", verifyToken,getUsers);



module.exports = router;