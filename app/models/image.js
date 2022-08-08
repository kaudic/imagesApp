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
    async getNextImgNotTagguedAndLinkedTables(index) {
        const sqlQuery = {
            text: `
            SELECT i.id,i.file_name,i.year,i.tag,l.id as locality_id, l.name as locality_name, e.id as event_id, e.name as event_name, json_AGG(jsonb_build_object('id',p.id,'name',p.name)) as person_name FROM image i
            LEFT JOIN image_person ip ON i.id = ip.image_id
            LEFT JOIN person p ON ip.person_id = p.id
            LEFT JOIN "event" e ON e.id = i.event
            LEFT JOIN "locality" l ON l.id = i.locality
            GROUP BY i.id, l.id, e.id
            HAVING i.tag=false AND i.id NOT IN (SELECT image_id FROM tag_socket) AND i.id < $1
            ORDER BY id DESC
            LIMIT 1`,
            values: [index],
        };
        const result = await db.query(sqlQuery);
        return result.rows[0];
    },
    async getPreviousImgNotTagguedAndLinkedTables(index) {
        const sqlQuery = {
            text: `
            SELECT i.id,i.file_name,i.year,i.tag,l.id as locality_id, l.name as locality_name, e.id as event_id, e.name as event_name, json_AGG(jsonb_build_object('id',p.id,'name',p.name)) as person_name FROM image i
            LEFT JOIN image_person ip ON i.id = ip.image_id
            LEFT JOIN person p ON ip.person_id = p.id
            LEFT JOIN "event" e ON e.id = i.event
            LEFT JOIN "locality" l ON l.id = i.locality
            GROUP BY i.id, l.id, e.id
            HAVING i.tag=false AND i.id NOT IN (SELECT image_id FROM tag_socket) AND i.id > $1
            ORDER BY id ASC
            LIMIT 1`,
            values: [index],
        };
        const result = await db.query(sqlQuery);
        return result.rows[0];
    },
    async getFirstImgNotTagguedAndLinkedTables() {
        const sqlQuery = {
            text: `
            SELECT i.id,i.file_name,i.year,i.tag,l.id as locality_id, l.name as locality_name, e.id as event_id, e.name as event_name, json_AGG(jsonb_build_object('id',p.id,'name',p.name)) as person_name FROM image i
            LEFT JOIN image_person ip ON i.id = ip.image_id
            LEFT JOIN person p ON ip.person_id = p.id
            LEFT JOIN "event" e ON e.id = i.event
            LEFT JOIN "locality" l ON l.id = i.locality
            GROUP BY i.id, l.id, e.id
            HAVING i.tag=false AND i.id NOT IN (SELECT image_id FROM tag_socket)
            ORDER BY id DESC
            LIMIT 1`,
            values: [],
        };
        const result = await db.query(sqlQuery);
        return result.rows[0];
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
    async getAllFilenames() {
        const sqlQuery = {
            text: `
            SELECT file_name FROM image;`,
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
    async deleteImageByFilename(filename) {
        const sqlQuery = {
            text: `
            DELETE FROM image WHERE file_name=$1 RETURNING*`,
            values: [filename],
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
    async deleteImageBeingTaggued(imageId, socket) {
        const sqlQuery = {
            text: `
            DELETE FROM tag_socket WHERE (image_id = $1 AND socket = $2) RETURNING *;`,
            values: [imageId, socket],
        };
        const result = await db.query(sqlQuery);
        return result.rows[0];
    },
    async deleteAllBeingTaggued() {
        const sqlQuery = {
            text: `
            DELETE FROM tag_socket ;`,
            values: [],
        };
        const result = await db.query(sqlQuery);
        return result.rows;
    },
    async deleteImageBeingTagguedBySocket(socket) {
        const sqlQuery = {
            text: `
            DELETE FROM tag_socket WHERE socket = $1 RETURNING *;`,
            values: [socket],
        };
        const result = await db.query(sqlQuery);
        return result.rows[0];
    },
    async getImagesbeingTaggued() {
        const sqlQuery = {
            text: `
            SELECT * FROM tag_socket;`,
            values: [],
        };
        const result = await db.query(sqlQuery);
        return result.rows;
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
    async insertOneAsBeingTaggued(imageId, socket, fileName) {
        const sqlQuery = {
            text: `
            INSERT INTO tag_socket ("image_id","socket","file_name") VALUES ($1,$2,$3)
            `,
            values: [imageId, socket, fileName],
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
    async countTagAndNotTagguedPerYear() {
        const sqlQuery = {
            text: `
                SELECT
                year,
                SUM(
                CASE WHEN tag='true' THEN 1 else 0 END) as taggued,
                SUM(
                CASE WHEN tag='false' THEN 1 else 0 END) as not_taggued
                FROM image
                GROUP BY "year"
                ORDER BY year ASC;
            `,
            values: [],
        };
        const result = await db.query(sqlQuery);
        return result.rows;
    },
    async countTagAndNotTaggued() {
        const sqlQuery = {
            text: `
                SELECT
                SUM(
                CASE WHEN tag='true' THEN 1 else 0 END) as taggued,
                SUM(
                CASE WHEN tag='false' THEN 1 else 0 END) as not_taggued
                FROM image;
            `,
            values: [],
        };
        const result = await db.query(sqlQuery);
        return result.rows[0];
    }

};

module.exports = imageDataMapper;