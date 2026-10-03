const pool = require("../config/db");

const getAllUsers = async () => {
    const result = await pool.query(
        `SELECT id, name, email, role, created_at
         FROM users
         ORDER BY id`
    );

    return result.rows;
};
const createUser = async (name, email, password, role) => {
    const result = await pool.query(
        `INSERT INTO users (name, email, password, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id, name, email, role, created_at`,
        [name, email, password, role]
    );

    return result.rows[0];
};
module.exports = {
    getAllUsers, createUser
};
