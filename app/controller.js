const utils = require('./helpers/utils');

const controller = {

    homePage: (req, res) => {
        res.render('console.ejs');
    },
    loggIn: (req, res) => {
        // get the login and password from the request body
        const { login, password } = req.body;

        // check if info are correct
        if (login === process.env.LOGIN && password === process.env.PASSWORD) {
            // if yes then generate a token and send it to Front page
            const accessToken = utils.generateToken({ login: login, password: password });


            return res.json({
                result: true,
                accessToken
            });
        };

        // if not then send an error message in json
        res.json({
            result: false,
            message: 'Les informations de connexion ne sont pas correctes'
        });
    }


};

module.exports = controller;