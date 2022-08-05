// imports modules for Router
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const upLoadImages = require('../middlewares/uploadImages');
const controller = require('../controller');
const handler = require('../helpers/controllerHandler');
const path = require('path');


router.use(express.json());

// Route for welcoming page - controling token first
router.get('/', handler(controller.renderHomePage));

const staticPath = path.normalize(`${__dirname}/../../public/`);

// It will enable reverse proxy to get the static elements
router.get(/js/, express.static(staticPath));
router.get(/css/, express.static(staticPath));
router.get(/assets/, express.static(staticPath));

// Upload Routes
// !add auth controle duplicates add in DB with Year (or not) and tag or not
router.get('/upload', handler(controller.renderUploadPage));
router.post('/upload', upLoadImages(), handler(controller.addImagesToDBAfterUpLoad), handler(controller.renderUploadPage));

// Tag Routes
router.get('/tags/OneImageInTagView/:imageId', handler(controller.renderOneImageInTagPage));
router.get('/tags', handler(controller.renderTagPage));
router.get('/tags/getPersons', handler(controller.getAllPersons));
router.get('/tags/getAllLocalities', handler(controller.getAllLocalities));
router.get('/tags/getAllEvents', handler(controller.getAllEvents));

// Image Routes
router.get('/images/getAllNotTagguedWithLinkedTables', handler(controller.getAllImagesNotTagguedAndLinkedTables));
router.post('/images/getImageInfoWithLinkedTables', handler(controller.getImageInfoWithLinkedTables));
router.post('/images/deleteBeingTagged', handler(controller.deleteImageBeingTaggued));
router.get('/images/beingTaggued', handler(controller.getImagesbeingTaggued));
router.post('/images/insertOneAsBeingTaggued', handler(controller.insertOneAsBeingTaggued));
router.get('/images/countTagAndNotTaggued', handler(controller.countTagAndNotTaggued));
router.get('/images/countTagAndNotTagguedPerYear', handler(controller.countTagAndNotTagguedPerYear));
router.patch('/images/updateTags', handler(controller.updateTags));
router.delete('/images/delete', handler(controller.deleteImage));
router.post('/images/downloadByFileName', handler(controller.downloadFileByName));

// Search Routes
router.get('/search/getAllImgAndLinkedTables', handler(controller.getAllImgAndLinkedTables));

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
router.get('/search', handler(controller.renderSearchPage));

// Catch the error created by controller Handler
router.use(handler(controller.error));

module.exports = router;