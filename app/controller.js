const utils = require('./helpers/utils');

const controller = {

    homePage: (req, res) => {

        res.render('index.ejs');
    },
    uploadPage: (req, res) => {
        res.render('upload.ejs');
    }
};

module.exports = controller;