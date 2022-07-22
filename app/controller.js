const utils = require('./helpers/utils');
const personDataMapper = require('./models/person')

const controller = {

    renderHomePage: (req, res) => {
        res.render('index.ejs');
    },
    renderUploadPage: (req, res) => {
        res.render('upload.ejs');
    },
    renderTagPage: (req, res) => {
        res.render('tag.ejs');
    },
    createPerson: async (req, res) => {
        const { personName } = req.body;

        const newPerson = await personDataMapper.createPerson(personName);

        if (newPerson) {
            res.json({
                result: true,
                message: 'La nouvelle personne a bien été créé'
            })
        }

    },
    error: (err, req, res, _next) => {

        console.log('errorController! :' + err.message);

        res.status(400).json({
            result: false,
            message: err.message
        });
    }

};

module.exports = controller;