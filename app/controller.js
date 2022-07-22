const personDataMapper = require('./models/person');
const localityDataMapper = require('./models/locality');
const eventDataMapper = require('./models/event');

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
    modifyPerson: async (req, res) => {
        const { personId, personName } = req.body;

        const updatedPerson = await personDataMapper.modifyPerson(personId, personName);

        if (updatedPerson) {
            res.json({
                result: true,
                message: 'La personne a bien été modifié'
            })
        }

    },
    deletePerson: async (req, res) => {
        const { personId } = req.body;

        const deletedPerson = await personDataMapper.deletePerson(personId);

        if (deletedPerson) {
            res.json({
                result: true,
                message: 'La personne a bien été supprimée'
            })
        }
    },
    createEvent: async (req, res) => {
        const { eventName } = req.body;

        const newEvent = await eventDataMapper.createEvent(eventName);

        if (newEvent) {
            res.json({
                result: true,
                message: 'Le nouvel évènement a bien été créé'
            })
        }

    },
    modifyEvent: async (req, res) => {
        const { eventId, eventName } = req.body;

        const updatedEvent = await eventDataMapper.modifyEvent(eventId, eventName);

        if (updatedEvent) {
            res.json({
                result: true,
                message: 'L\'évènement a bien été modifié'
            })
        }

    },
    deleteEvent: async (req, res) => {
        const { eventId } = req.body;

        const deletedEvent = await eventDataMapper.deleteEvent(eventId);

        if (deletedEvent) {
            res.json({
                result: true,
                message: 'L\'évènement a bien été supprimé'
            })
        }
    },
    createLocality: async (req, res) => {
        const { localityName } = req.body;

        const newLocality = await localityDataMapper.createLocality(localityName);

        if (newLocality) {
            res.json({
                result: true,
                message: 'Le nouveau lieu a bien été créé'
            })
        }

    },
    modifyLocality: async (req, res) => {
        const { localityId, localityName } = req.body;

        const updatedLocality = await localityDataMapper.modifyLocality(localityId, localityName);

        if (updatedLocality) {
            res.json({
                result: true,
                message: 'Le lieu a bien été modifié'
            })
        }

    },
    deleteLocality: async (req, res) => {
        const { localityId } = req.body;

        const deletedLocality = await localityDataMapper.deleteLocality(localityId);

        if (deletedLocality) {
            res.json({
                result: true,
                message: 'Le lieu a bien été supprimé'
            })
        }
    },
    getAllPersons: async (req, res) => {
        const persons = await personDataMapper.getAllPersons();

        if (persons) {
            res.json({
                result: true,
                message: 'Les personnes en BDD sont dans l\'attribut data',
                data: persons
            })
        }

    },
    getAllLocalities: async (req, res) => {
        const localities = await localityDataMapper.getAllLocalities();

        if (localities) {
            res.json({
                result: true,
                message: 'Les lieux en BDD sont dans l\'attribut data',
                data: localities
            })
        }

    },
    getAllEvents: async (req, res) => {
        const events = await eventDataMapper.getAllEvents();

        if (events) {
            res.json({
                result: true,
                message: 'Les évènements en BDD sont dans l\'attribut data',
                data: events
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