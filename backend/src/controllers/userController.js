const {getAllUsers}=require("../models/userModel")

const getUsers = async (req, res, next) => {
    try {
        const users = await getAllUsers();

        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUsers
};