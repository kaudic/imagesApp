const db = require('../config/client');

const eventDataMapper = {
    async createEvent(eventName) {
        const sqlQuery = {
            text: 'INSERT INTO "event" ("name") VALUES ($1) RETURNING *',
            values: [eventName],
        };
        const result = await db.query(sqlQuery);
        return result.rows[0];
    },
    async modifyEvent(eventId, eventName) {
        const sqlQuery = {
            text: 'UPDATE "event" SET name = $2 WHERE id=$1 RETURNING *',
            values: [eventId, eventName],
        };
        const result = await db.query(sqlQuery);
        return result.rows[0];
    },
    async deleteEvent(eventId) {
        const sqlQuery = {
            text: 'DELETE FROM "event" WHERE id = $1 RETURNING *',
            values: [eventId],
        };
        const result = await db.query(sqlQuery);
        return result.rows[0];
    },
    async getAllEvents() {
        const sqlQuery = `SELECT * FROM event ORDER BY name`;
        const results = await db.query(sqlQuery);
        return results.rows;
    }
};

module.exports = eventDataMapper;