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
const updateService = async (
    serviceId,
    name,
    description,
    averageServiceTime,
    isActive
) => {
    const result = await pool.query(
        `UPDATE services
         SET name = COALESCE($1, name),
             description = COALESCE($2, description),
             average_service_time = COALESCE($3, average_service_time),
             is_active = COALESCE($4, is_active),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $5
         RETURNING *`,
        [
            name,
            description,
            averageServiceTime,
            isActive,
            serviceId
        ]
    );

    return result.rows[0];
};

const deleteService = async (serviceId) => {
    const result = await pool.query(
        `DELETE FROM services
         WHERE id = $1
         RETURNING *`,
        [serviceId]
    );

    return result.rows[0];
};

module.exports = {
    createService,
    getServicesByBusinessId,
    updateService,
    deleteService
};