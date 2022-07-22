const db = require('../config/client');

const localityDataMapper = {
    async createLocality(localityName) {
        const sqlQuery = {
            text: 'INSERT INTO "locality" ("name") VALUES ($1) RETURNING *',
            values: [localityName],
        };

        const result = await db.query(sqlQuery);
        return result.rows[0];

    },
    async modifyLocality(localityId, localityName) {
        const sqlQuery = {
            text: 'UPDATE "locality" SET name = $2 WHERE id=$1 RETURNING *',
            values: [localityId, localityName],
        };
        const result = await db.query(sqlQuery);
        return result.rows[0];
    },
    async deleteLocality(localityId) {
        const sqlQuery = {
            text: 'DELETE FROM "locality" WHERE id = $1 RETURNING *',
            values: [localityId],
        };
        const result = await db.query(sqlQuery);
        return result.rows[0];
    },
    async getAllLocalities() {
        const sqlQuery = `SELECT * FROM locality`;
        const results = await db.query(sqlQuery);
        return results.rows;
    }
};

module.exports = localityDataMapper;