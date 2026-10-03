const pool = require("../config/db");

const createBusiness = async (
    ownerId,
    name,
    description,
    address,
    phone
) => {
    const result = await pool.query(
        `INSERT INTO businesses
        (owner_id, name, description, address, phone)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [ownerId, name, description, address, phone]
    );

    return result.rows[0];
};

const getBusinessById = async (businessId) => {
    const result = await pool.query(
        `SELECT *
         FROM businesses
         WHERE id = $1`,
        [businessId]
    );

    return result.rows[0];
};

module.exports = {
    createBusiness,
    getBusinessById
};