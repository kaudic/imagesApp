// imports modules for Router
const express = require('express');
const router = express.Router();
const auth = require('./middlewares/auth');
const upLoadImages = require('./middlewares/uploadImages');
const controller = require('./controller');
const handler = require('./helpers/controllerHandler');

// Route for welcoming page - controling token first
router.get('/', controller.renderHomePage);

// Upload Routes
// !add new names to files when uploading except on first download
// !add auth
router.get('/upload', controller.renderUploadPage);
router.post('/upload', upLoadImages(), controller.renderUploadPage);

// Tag Routes
router.get('/tags', controller.renderTagPage);

router.get('/tags/getPersons', controller.getAllPersons);
router.get('/tags/getAllLocalities', controller.getAllLocalities);
router.get('/tags/getAllEvents', controller.getAllEvents);

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

// Catch the error created by controller Handler
router.use(controller.error);

module.exports = router;