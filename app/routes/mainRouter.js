// imports modules for Router
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const upLoadImages = require('../middlewares/uploadImages');
const controller = require('../controller');
const handler = require('../helpers/controllerHandler');
const path = require('path');


router.use((req, res, next) => {
    console.log('request reçue dans mainRouter: ' + req.url);
    next();
})
// Route for welcoming page - controling token first
router.get('/', controller.renderHomePage);

const staticPath = path.normalize(`${__dirname}/../../public/`);
console.log('staticPath: ' + staticPath);

// It will enable reverse proxy to get the static elements
router.get(/js/, express.static(staticPath));
router.get(/css/, express.static(staticPath));
router.get(/assets/, express.static(staticPath));

// Upload Routes
// !add auth controle duplicates add in DB with Year (or not) and tag or not
router.get('/upload', controller.renderUploadPage);
router.post('/upload', upLoadImages(), controller.addImagesToDBAfterUpLoad, controller.renderUploadPage);

// Tag Routes
router.get('/tags', controller.renderTagPage);
router.get('/tags/getPersons', controller.getAllPersons);
router.get('/tags/getAllLocalities', controller.getAllLocalities);
router.get('/tags/getAllEvents', controller.getAllEvents);

// Image Routes
router.get('/images/getAllNotTagguedWithLinkedTables', controller.getAllImagesNotTagguedAndLinkedTables);
router.patch('/images/updateTags', controller.updateTags);
router.delete('/images/delete', controller.deleteImage);
router.post('/images/downloadByFileName', controller.downloadFileByName);

// Search Routes
router.get('/search/getAllImgAndLinkedTables', controller.getAllImgAndLinkedTables);

// Creation
router.post('/tags/person', handler(controller.createPerson));
router.post('/tags/locality', handler(controller.createLocality));
router.post('/tags/event', handler(controller.createEvent));

// Delete
router.delete('/tags/person', handler(controller.deletePerson));
router.delete('/tags/locality', handler(controller.deleteLocality));
router.delete('/tags/event', handler(controller.deleteEvent));

// Modify
router.put('/tags/person', handler(controller.modifyPerson));
router.put('/tags/locality', handler(controller.modifyLocality));
router.put('/tags/event', handler(controller.modifyEvent));

// Search Routes
router.get('/search', controller.renderSearchPage);

// Catch the error created by controller Handler
router.use(controller.error);

module.exports = router;