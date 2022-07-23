// script to insert the fileName from the file imagesSources.json

// get the client
require('dotenv').config();
const db = require('../app/config/client');

// variable to accomodate all the queries
const queries = [];

// Read json file
const imageSource = require('../data/imagesSource.json');

// counter
let counter = -1;

// Loop on the file
(async () => {
    imageSource.forEach(async (img) => {

        // ! add binary fingerPrints here and in database column with unique constraint
        const sqlQuery = {
            text: 'INSERT INTO "image" ("file_name","year") VALUES ($1,$2)',
            values: [img.fileName, parseInt(img.year)],
        };

        queries.push(db.query(sqlQuery));

    });

    // Launch all the insert requests in parallels
    await Promise.all(queries);

})();

