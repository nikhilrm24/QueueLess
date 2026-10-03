const pool = require("../config/db");

const createQueueEvent = async (
    queueId,
    entryId,
    eventType,
    metadata = null
) => {
    const result = await pool.query(
        `INSERT INTO queue_events
        (queue_id, entry_id, event_type, metadata)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [queueId, entryId, eventType, metadata]
    );

    return result.rows[0];
};

const getQueueEvents = async (queueId) => {
    const result = await pool.query(
        `SELECT *
         FROM queue_events
         WHERE queue_id = $1
         ORDER BY created_at ASC`,
        [queueId]
    );

    return result.rows;
};

module.exports = {
    createQueueEvent,
    getQueueEvents
};