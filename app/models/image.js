const db = require('../config/client');

const imageDataMapper = {

    async getAllImgNotTagguedAndLinkedTables() {
        const sqlQuery = {
            text: `
            SELECT i.id,i.file_name,i.year,i.tag,l.id as locality_id, l.name as locality_name, e.id as event_id, e.name as event_name, json_AGG(jsonb_build_object('id',p.id,'name',p.name)) as person_name FROM image i
            LEFT JOIN image_person ip ON i.id = ip.image_id
            LEFT JOIN person p ON ip.person_id = p.id
            LEFT JOIN "event" e ON e.id = i.event
            LEFT JOIN "locality" l ON l.id = i.locality
            GROUP BY i.id, l.id, e.id
            HAVING i.tag=false
            ORDER BY id DESC`,
            values: [],
        };
        const result = await db.query(sqlQuery);
        return result.rows;
    },
    async getAllImgAndLinkedTables() {
        const sqlQuery = {
            text: `
            SELECT i.id,i.file_name,i.year,i.tag,l.id as locality_id, l.name as locality_name, e.id as event_id, e.name as event_name, json_AGG(jsonb_build_object('id',p.id,'name',p.name)) as person_name FROM image i
            LEFT JOIN image_person ip ON i.id = ip.image_id
            LEFT JOIN person p ON ip.person_id = p.id
            LEFT JOIN "event" e ON e.id = i.event
            LEFT JOIN "locality" l ON l.id = i.locality
            GROUP BY i.id, l.id, e.id
            ORDER BY id DESC`,
            values: [],
        };
        const result = await db.query(sqlQuery);
        return result.rows;
    },
    async getAllFingerPrints() {
        const sqlQuery = {
            text: `
            SELECT fingerprints FROM image;`,
            values: [],
        };
        const result = await db.query(sqlQuery);
        return result.rows;
    },
    async insertImageWithYearAndFingerPrints(img) {
        const sqlQuery = {
            text: `
            INSERT INTO image ("file_name","year","fingerprints") VALUES ($1,$2,$3);`,
            values: [img.fileName, img.year, img.fingerPrints],
        };
        const result = await db.query(sqlQuery);
        return result.rows[0];
    },
    async deleteImage(imageId) {
        const sqlQuery = {
            text: `
            DELETE FROM image WHERE id=$1 RETURNING*`,
            values: [imageId],
        };
        const result = await db.query(sqlQuery);
        return result.rows[0];
    },
    async updateImageYear(imageId, year) {
        const sqlQuery = {
            text: `
            UPDATE image SET year=$2 WHERE id=$1 RETURNING*`,
            values: [imageId, year],
        };
        const result = await db.query(sqlQuery);
        return result.rows[0];
    },
    async getImageInfoWithLinkedTables(imageId) {
        const sqlQuery = {
            text: `
            SELECT i.id,i.file_name,i.year,i.tag,l.id as locality_id, l.name as locality_name, e.id as event_id, e.name as event_name, json_AGG(jsonb_build_object('id',p.id,'name',p.name)) as person_name FROM image i
            LEFT JOIN image_person ip ON i.id = ip.image_id
            LEFT JOIN person p ON ip.person_id = p.id
            LEFT JOIN "event" e ON e.id = i.event
            LEFT JOIN "locality" l ON l.id = i.locality
            GROUP BY i.id, l.id, e.id
            HAVING i.id=$1;`,
            values: [imageId],
        };
        const result = await db.query(sqlQuery);
        return result.rows[0];
    },
    async updateImageYear(imageId, year) {
        const sqlQuery = {
            text: `
            UPDATE image SET year=$2 WHERE id=$1 RETURNING*`,
            values: [imageId, year],
        };
        const result = await db.query(sqlQuery);
        return result.rows[0];
    },
    async updateImageLocality(imageId, localityId) {
        const sqlQuery = {
            text: `
            UPDATE image SET locality=$2 WHERE id=$1 RETURNING*`,
            values: [imageId, localityId],
        };
        const result = await db.query(sqlQuery);
        return result.rows[0];
    },
    async updateImageEvent(imageId, eventId) {
        const sqlQuery = {
            text: `
            UPDATE image SET event=$2 WHERE id=$1 RETURNING*`,
            values: [imageId, eventId],
        };
        const result = await db.query(sqlQuery);
        return result.rows[0];
    },
    async deleteImageTagguedPersons(imageId) {
        const sqlQuery = {
            text: `
            DELETE FROM image_person WHERE image_id=$1 RETURNING*`,
            values: [imageId],
        };
        const result = await db.query(sqlQuery);
        return result.rows;
    },
    async updateImageTagguedPerson(imageId, personId) {
        const sqlQuery = {
            text: `
            INSERT INTO image_person ("image_id","person_id") VALUES ($1,$2) RETURNING*`,
            values: [imageId, personId],
        };
        const result = await db.query(sqlQuery);
        return result.rows[0];
    },
    async updateImageBooleanColumn(imageId, bool) {
        const sqlQuery = {
            text: `
            UPDATE image SET tag=$2 WHERE id=$1 RETURNING*`,
            values: [imageId, bool],
        };
        const result = await db.query(sqlQuery);
        return result.rows[0];
    },

};

module.exports = imageDataMapper;