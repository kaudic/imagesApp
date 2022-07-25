const db = require('../config/client');

const imageDataMapper = {

    async getAllImgNotTagguedAndLinkedTables() {
        const sqlQuery = {
            text: `
            SELECT i.id,i.file_name,i.year,l.id as locality_id, l.name as locality_name, e.id as event_id, e.name as event_name, json_AGG(jsonb_build_object('id',p.id,'name',p.name)) as person_name FROM image i
LEFT JOIN image_person ip ON i.id = ip.image_id
LEFT JOIN person p ON ip.person_id = p.id
LEFT JOIN "event" e ON e.id = i.event
LEFT JOIN "locality" l ON l.id = i.locality
GROUP BY i.id, l.id, e.id
HAVING i.tag=false;`,
            values: [],
        };
        const result = await db.query(sqlQuery);
        return result.rows;
    },
};

module.exports = imageDataMapper;