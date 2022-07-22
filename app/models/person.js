const db = require('../config/client');

const personDataMapper = {
    async createPerson(personName) {
        const sqlQuery = {
            text: 'INSERT INTO "person" ("name") VALUES ($1) RETURNING *',
            values: [personName],
        };
        const result = await db.query(sqlQuery);
        return result.rows[0];
    },
    async modifyPerson(personId, personName) {
        const sqlQuery = {
            text: 'UPDATE "person" SET name = $2 WHERE id=$1 RETURNING *',
            values: [personId, personName],
        };
        const result = await db.query(sqlQuery);
        return result.rows[0];
    },
    async deletePerson(personId) {
        const sqlQuery = {
            text: 'DELETE FROM "person" WHERE id = $1 RETURNING *',
            values: [personId],
        };
        const result = await db.query(sqlQuery);
        return result.rows[0];
    },
    async getAllPersons() {
        const sqlQuery = `SELECT * FROM person`;
        const results = await db.query(sqlQuery);
        return results.rows;
    }
};

module.exports = personDataMapper;