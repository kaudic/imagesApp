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
};

module.exports = personDataMapper;