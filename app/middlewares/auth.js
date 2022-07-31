const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const utils = require('../helpers/utils');

const auth = async (req, res, next) => {
    // get the token from the request
    const token = req.headers['authorization'];
    console.log('TOKEN reçu dans la request: ' + token);

    // if token not existing render the login page of the console server
    if (token == null) {
        console.log('pas de token trouvé dans la request: renvoie vers la page login de la console du server audicServer');
        // return res.redirect(`${process.env.BASE_URL}:3000`);
        return res.redirect(`/`);
    }

    // if token exist then decode it and compare it to .env File of audicServerConsole project
    try {
        const credentials = utils.readAndReturnCredentials();
        const decodedToken = await jwt.verify(token, credentials.accessTokenSecret);
        const { login, password } = decodedToken;

        if (login == credentials.login && password == credentials.password) {
            return next();

        } else {
            res.json({
                result: false,
                message: 'les informations de connexion ne sont pas correctes'
            })
        }
    }
    catch (err) {
        console.log('erreur pendant la vérification du token: ' + err.message);

        res.json({
            result: false,
            message: 'les informations de connexion ne sont pas correctes'
        })
    }



};


module.exports = auth;