const pool = require("../config/db");

const createQueue = async (
    serviceId,
    name,
    tokenPrefix
) => {
    const result = await pool.query(
        `INSERT INTO queues
        (service_id, name, token_prefix)
        VALUES ($1, $2, $3)
        RETURNING *`,
        [
            serviceId,
            name,
            tokenPrefix || "A"
        ]
    );

    return result.rows[0];
};

const getQueueById = async (queueId) => {
    const result = await pool.query(
        `SELECT *
         FROM queues
         WHERE id = $1`,
        [queueId]
    );

    return result.rows[0];
};

module.exports = {
    createQueue,
    getQueueById
};