const personDataMapper = require('./models/person');
const localityDataMapper = require('./models/locality');
const eventDataMapper = require('./models/event');
const imageDataMapper = require('./models/image');
const fs = require('fs');
const path = require('path');
const utils = require('./helpers/utils');

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
    renderOneImageInTagPage: (req, res) => {
        res.render('tag.ejs', { type: 'singleTagMode', imageId: req.params.imageId });
    },
    renderSearchPage: (req, res) => {
        res.render('search.ejs');
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
    deleteImage: async (req, res) => {
        const { imageId, fileName } = req.body;

        // delete from BD
        const deletedImage = await imageDataMapper.deleteImage(imageId);
        const pathToFileToDelete = path.normalize(`${__dirname}/../public/assets/images/${fileName}`);

        // delete from directory
        fs.unlink(pathToFileToDelete, (err) => {
            if (err) throw err;
            console.log(`file ${pathToFileToDelete} well deleted`);
        });

        res.json({
            result: true,
            message: `file ${pathToFileToDelete} well deleted`
        });
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
    getAllImagesNotTagguedAndLinkedTables: async (req, res) => {
        const imagesInfo = await imageDataMapper.getAllImgNotTagguedAndLinkedTables();

        if (imagesInfo) {
            res.json({
                result: true,
                message: 'Les infos des images sont dans l\'attribut data',
                data: imagesInfo
            })
        }
    },
    getAllImgAndLinkedTables: async (req, res) => {
        const imagesInfo = await imageDataMapper.getAllImgAndLinkedTables();

        if (imagesInfo) {
            res.json({
                result: true,
                message: 'Les infos des images sont dans l\'attribut data',
                data: imagesInfo
            })
        }
    },
    getImageInfoWithLinkedTables: async (req, res) => {
        const { imageId } = req.body;

        const imageInfo = await imageDataMapper.getImageInfoWithLinkedTables(imageId);

        if (imageInfo) {
            res.json({
                result: true,
                message: 'Les infos de l\'image sont dans l\'attribut data',
                data: [imageInfo]
            })
        }
    },
    updateTags: async (req, res) => {
        let { imageId, year, localityId, eventId, personsIds } = req.body;

        // if no option selected on browser then id is equal to 0, but no exist in DB - so we put null instead
        if (localityId === '0') localityId = null;
        if (eventId === '0') eventId = null;

        // update one field by one field and delete all person taggued
        const initialQueries = [];
        initialQueries.push(
            imageDataMapper.updateImageYear(imageId, year),
            imageDataMapper.updateImageLocality(imageId, localityId),
            imageDataMapper.updateImageEvent(imageId, eventId),
            imageDataMapper.deleteImageTagguedPersons(imageId),
            imageDataMapper.updateImageBooleanColumn(imageId, true)
        );
        await Promise.all(initialQueries);

        // tag all persons
        const updateTagguedPersonsQueries = [];
        personsIds.forEach((personId) => {
            updateTagguedPersonsQueries.push(imageDataMapper.updateImageTagguedPerson(imageId, personId))
        });
        await Promise.all(updateTagguedPersonsQueries);

        // Get full info to send back to front
        const updatedImage = await imageDataMapper.getImageInfoWithLinkedTables(imageId);

        res.json({
            result: true,
            message: 'imageTags well updated, full image Info in data attribute',
            data: updatedImage
        });

    },
    downloadFileByName(req, res) {

        const fileName = req.body.fileName;
        const filePath = path.normalize(`${__dirname}/../public/assets/images/${fileName}`);
        res.writeHead(200, {
            "Content-Type": "application/octet-stream",
            "Content-Disposition": `attachment; filename=${fileName}`
        });

        fs.createReadStream(filePath).pipe(res);
    },
    async addImagesToDBAfterUpLoad(req, res, next) {
        const { checkboxYear, checkboxTag } = req.body;
        let year = null;
        if (checkboxYear) {
            year = new Date().getFullYear();
        }

        // calculate temp path and images path to give to utils function
        const tempPath = path.normalize(`${__dirname}/../public/assets/images/temp`);
        const imagesPath = path.normalize(`${__dirname}/../public/assets/images`);

        // read temp folder and calculate fingerPrints
        // check if fingerPrints already exist in DB -if yes delete files
        const imagesToInsert = await utils.filterFilesBeforeInsertInDb(tempPath, imagesPath, year);

        // create Image in DB (with Year or Not) and delete files
        const insertQueries = [];
        imagesToInsert.forEach((img) => {
            insertQueries.push(imageDataMapper.insertImageWithYearAndFingerPrints(img))
        })

        await Promise.all(insertQueries);

        // if we do not want to tag then render upload page by the next
        if (!checkboxTag) {
            next();
        }

        // we want to tag now so let's end the response and the front will change the page
        res.end();
    },
    async countTagAndNotTagguedPerYear(req, res) {
        const countsInfo = await imageDataMapper.countTagAndNotTagguedPerYear();

        if (countsInfo) {
            const shapedData = [['Year', 'Tagguées', { role: 'annotation' }, 'Non Tagguées', { role: 'annotation' }]];
            countsInfo.forEach((count) => {
                shapedData.push([count.year.toString(), parseInt(count.taggued), parseInt(count.taggued), parseInt(count.not_taggued), parseInt(count.not_taggued)]);
            });

            res.json({
                result: true,
                message: 'Le comptage des images tagguées et non tagguées par an est dans l\'attribut data',
                data: shapedData
            })
        }

    },
    async countTagAndNotTaggued(req, res) {
        const countsInfo = await imageDataMapper.countTagAndNotTaggued();

        const shapedData = [['Status', 'Nb images']];
        if (countsInfo) {
            shapedData.push(['Tagguées', parseInt(countsInfo.taggued)]);
            shapedData.push(['Non Tagguées', parseInt(countsInfo.not_taggued)]);
        }

        res.json({
            result: true,
            message: 'Le comptage des images tagguées et non tagguées est dans l\'attribut data',
            data: shapedData
        })
    },
    async deleteImageBeingTaggued(req, res) {
        const { imageId } = req.params;
        await imageDataMapper.deleteImageBeingTaggued(imageId);

        res.json({
            result: true,
            message: 'La suppression du tag en cours de l\èimage a bien été effectué',
        });
    },
    async insertOneAsBeingTaggued(req, res) {
        const { imageId, socket, fileName } = req.body;

        await imageDataMapper.insertOneAsBeingTaggued(imageId, socket, fileName);

        res.json({
            result: true,
            message: 'L\'image a bien été insérée dans la table comme étant en cours de Tag',
        });
    },
    async getImagesbeingTaggued(req, res) {
        const imagesBeingTaggued = await imageDataMapper.getImagesbeingTaggued();

        if (imagesBeingTaggued) {
            res.json({
                result: true,
                message: 'La liste des images en cours de Tag est dans l\'attribut data',
                data: imagesBeingTaggued
            });
        }
    },
    error: (err, req, res, _next) => {

        console.log('errorController! :' + err.message);
        console.log(err);

        res.status(400).json({
            result: false,
            message: err.message
        });
    },

};

module.exports = controller;