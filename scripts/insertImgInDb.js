// script to insert the fileName from the file imagesSources.json

// get the client
require('dotenv').config();
const db = require('../app/config/client');

console.log(process.env.DATABASE_URL);

// variable to accomodate all the queries
const queries = [];

// Read json file
const imageSource = require('../data/final/years.json');

// Loop on the file
(async () => {
    imageSource.forEach(async (img) => {

        const sqlQuery = {
            text: 'INSERT INTO "image" ("file_name","year","fingerprints") VALUES ($1,$2,$3)',
            values: [img.fileName, parseInt(img.year), img.fingerPrints],
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

