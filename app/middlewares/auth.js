const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const auth = async (req, res, next) => {
    // get the token from the request
    const token = req.headers['authorization'];
    console.log('TOKEN reçu dans la request: ' + token);

    // if token not existing render the login page
    if (token == null) {
        console.log('pas de token trouvé dans la request: renvoie vers la page login');
        return res.render('login.ejs');
    }

    // if token exist then decode it and compare to .env Login and password
    try {
        const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const { login, password } = decodedToken;

        if (login == process.env.LOGIN && password == process.env.PASSWORD) {
            const pathToConsoleFile = path.normalize(`${__dirname}/../views/console.ejs`);

            fs.readFile(pathToConsoleFile, 'utf8', (err, data) => {
                return res.json({
                    result: true,
                    html: data
                })
            });

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