// script to insert the fileName from the file imagesSources.json

// get the client
require('dotenv').config();
const db = require('../app/config/client');

// variable to accomodate all the queries
const queries = [];

// Read json file
const imageSource = require('../data/eventMariageK&M.json');

// Loop on the file
(async () => {
    imageSource.forEach(async (img) => {

        // !Attention to change the number '2' by the id of the wedding's id event

        const sqlQuery = {
            text: 'UPDATE "image" SET event = $1 WHERE file_name=$2',
            values: [1, img.fileName],
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

