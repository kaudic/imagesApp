const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const utils = {

    readAndReturnCredentials: () => {
        // we will read the password, login, and token secret from the .env file of the audisServerConsole project
        const pathToCredentials = path.normalize(`${__dirname}/../../../audicServerConsole/.env`);
        const fileText = fs.readFile(pathToCredentials, 'utf8', (err, data) => {
            const textArray = data.split('\r').map((x) => x.replace('\n', ''));
            let login, password, accessTokenSecret;
            textArray.forEach((text) => {
                if (text.startsWith('LOGIN')) { login = text.replace('LOGIN=', '') };
                if (text.startsWith('PASSWORD')) { password = text.replace('PASSWORD=', '') };
                if (text.startsWith('ACCESS_TOKEN_SECRET')) { accessTokenSecret = text.replace('ACCESS_TOKEN_SECRET=', '') };
            });
            console.log(login, password, accessTokenSecret);
            return ({ login, password, accessTokenSecret });
        });

    },

};

module.exports = utils;