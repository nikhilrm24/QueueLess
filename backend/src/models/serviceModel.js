const pool = require("../config/db");

const createService = async (
    businessId,
    name,
    description,
    averageServiceTime
) => {
    const result = await pool.query(
        `INSERT INTO services
        (business_id, name, description, average_service_time)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [
            businessId,
            name,
            description,
            averageServiceTime
        ]
    );

    return result.rows[0];
};

const getServicesByBusinessId = async (businessId) => {
    const result = await pool.query(
        `SELECT *
         FROM services
         WHERE business_id = $1
         ORDER BY id`,
        [businessId]
    );

    return result.rows;
};

module.exports = {
    createService,
    getServicesByBusinessId
};