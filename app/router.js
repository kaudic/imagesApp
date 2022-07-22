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
router.get('/upload', controller.renderUploadPage);
router.post('/upload', upLoadImages(), controller.renderUploadPage);

// Tag Routes
router.get('/tags', controller.renderTagPage);
router.post('/tags/personCreation', handler(controller.createPerson));

// Catch the error created by controller Handler
router.use(controller.error);

module.exports = router;