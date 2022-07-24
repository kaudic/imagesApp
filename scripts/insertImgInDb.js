// script to insert the fileName from the file imagesSources.json

// get the client
require('dotenv').config();
const db = require('../app/config/client');

// variable to accomodate all the queries
const queries = [];

// Read json file
const imageSource = require('../data/year2040.json');

// Loop on the file
(async () => {
    imageSource.forEach(async (img) => {

        // ! add binary fingerPrints here and in database column with unique constraint
        const sqlQuery = {
            text: 'INSERT INTO "image" ("file_name","year","fingerprints") VALUES ($1,$2,$3)',
            values: [img.fileName, parseInt(img.year), img.fingerPrints],
        };

        // queries.push(db.query(sqlQuery));
        try {
            await db.query(sqlQuery);
        }
        catch (err) {
            console.log(err.message);
            console.log(img.fileName, img.year);
        }

    });

    // Launch all the insert requests in parallels
    // await Promise.all(queries);


})();

