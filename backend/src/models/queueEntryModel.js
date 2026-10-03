const pool = require("../config/db");

const createQueueEntry = async (
    queueId,
    userId,
    tokenNumber
) => {
    const result = await pool.query(
        `INSERT INTO queue_entries
        (queue_id, user_id, token_number)
        VALUES ($1, $2, $3)
        RETURNING *`,
        [queueId, userId, tokenNumber]
    );

    return result.rows[0];
};

const getActiveEntryByUser = async (queueId, userId) => {
    const result = await pool.query(
        `SELECT *
         FROM queue_entries
         WHERE queue_id = $1
           AND user_id = $2
           AND status IN ('WAITING', 'CALLED', 'SERVING')
         LIMIT 1`,
        [queueId, userId]
    );

    return result.rows[0];
};
const incrementQueueToken = async (queueId) => {
    const result = await pool.query(
        `UPDATE queues
         SET current_token = current_token + 1,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING *`,
        [queueId]
    );

    return result.rows[0];
};
const getQueuePosition = async (queueId, tokenNumber) => {
    const result = await pool.query(
        `SELECT COUNT(*) AS position
         FROM queue_entries
         WHERE queue_id = $1
           AND token_number <= $2
           AND status IN ('WAITING', 'CALLED', 'SERVING')`,
        [queueId, tokenNumber]
    );

    return Number(result.rows[0].position);
};
const getNextWaitingEntry = async (queueId) => {
    const result = await pool.query(
        `SELECT *
         FROM queue_entries
         WHERE queue_id = $1
           AND status = 'WAITING'
         ORDER BY token_number ASC
         LIMIT 1`,
        [queueId]
    );

    return result.rows[0];
};
const markEntryAsCalled = async (entryId) => {
    const result = await pool.query(
        `UPDATE queue_entries
         SET status = 'CALLED',
             called_at = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING *`,
        [entryId]
    );

    return result.rows[0];
};
const markEntryAsCompleted = async (entryId) => {
    const result = await pool.query(
        `UPDATE queue_entries
         SET status = 'COMPLETED',
             served_at = CURRENT_TIMESTAMP
         WHERE id = $1
           AND status = 'CALLED'
         RETURNING *`,
        [entryId]
    );

    return result.rows[0];
};
const markEntryAsSkipped = async (entryId) => {
    const result = await pool.query(
        `UPDATE queue_entries
         SET status = 'SKIPPED'
         WHERE id = $1
           AND status IN ('WAITING', 'CALLED')
         RETURNING *`,
        [entryId]
    );

    return result.rows[0];
};
const getQueueEntries = async (queueId) => {
    const result = await pool.query(
        `SELECT
            id,
            user_id,
            token_number,
            status,
            joined_at,
            called_at,
            served_at
         FROM queue_entries
         WHERE queue_id = $1
         ORDER BY token_number ASC`,
        [queueId]
    );

    return result.rows;
};
const markEntryAsCancelled = async (entryId) => {
    const result = await pool.query(
        `UPDATE queue_entries
         SET status = 'CANCELLED'
         WHERE id = $1
           AND status = 'WAITING'
         RETURNING *`,
        [entryId]
    );

    return result.rows[0];
};
const getActiveEntryDetails = async (queueId, userId) => {
    const result = await pool.query(
        `SELECT
            qe.id,
            qe.queue_id,
            qe.user_id,
            qe.token_number,
            qe.status,
            qe.joined_at,
            qe.called_at,
            qe.served_at,
            q.token_prefix,
            s.average_service_time
         FROM queue_entries qe
         JOIN queues q ON qe.queue_id = q.id
         JOIN services s ON q.service_id = s.id
         WHERE qe.queue_id = $1
           AND qe.user_id = $2
           AND qe.status IN ('WAITING', 'CALLED', 'SERVING')
         LIMIT 1`,
        [queueId, userId]
    );

    return result.rows[0];
};
module.exports = {
    createQueueEntry,
    getQueueEntries,
    getActiveEntryByUser,
    incrementQueueToken,
    getQueuePosition,
    getNextWaitingEntry,
    markEntryAsCalled,
    markEntryAsCompleted,
    markEntryAsSkipped,
    markEntryAsCalled,
    getActiveEntryDetails
};