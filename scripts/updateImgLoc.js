// script to insert the fileName from the file imagesSources.json

// get the client
require('dotenv').config();
const db = require('../app/config/client');

// variable to accomodate all the queries
const queries = [];

// Read json file
const imageSource = require('../data/final/localisationsById.json');

// Loop on the file
(async () => {
    imageSource.forEach(async (img) => {

        const sqlQuery = {
            text: 'UPDATE "image" SET locality = $1 WHERE file_name=$2',
            values: [img.localisation, img.fileName],
        };

        try {
            await db.query(sqlQuery);
        }
        catch (err) {
            console.log(err.message);
            console.log(img.fileName, img.year);
        }

    });


})();

