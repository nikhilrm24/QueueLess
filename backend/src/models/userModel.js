const pool = require("../config/db");

const getAllUsers = async () => {
    const result = await pool.query(
        `SELECT id, name, email, role, created_at
         FROM users
         ORDER BY id`
    );

    return result.rows;
};

module.exports = {
    getAllUsers
};