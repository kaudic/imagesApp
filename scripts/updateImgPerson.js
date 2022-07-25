// script to insert the fileName from the file imagesSources.json

// get the client
require('dotenv').config();
const db = require('../app/config/client');

// variable to accomodate all the queries
const queries = [];

// Read json file
const imageSource = require('../data/personMalo.json');

// Loop on the file
(async () => {
    imageSource.forEach(async (img) => {


        const sqlQuery1 = {
            text: 'SELECT id FROM image WHERE file_name=$1',
            values: [img.fileName],
        };

        try {
            let imageId = await db.query(sqlQuery1);
            imageId = imageId.rows[0].id;

            // !Attention to change the number '5' by the id of Malo
            const sqlQuery2 = {
                text: 'INSERT INTO image_person ("image_id","person_id") VALUES ($1,$2)',
                values: [parseInt(imageId), 1],
            };

            await db.query(sqlQuery2);
        }
        catch (err) {
            console.log(err.message);
            console.log(img.fileName);
        }

    });


})();

