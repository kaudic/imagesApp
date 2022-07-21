// imports modules for Router
const express = require('express');
const router = express.Router();
const auth = require('./middlewares/auth');
const upLoadImages = require('./middlewares/uploadImages');
const controller = require('./controller');

// Route for welcoming page - controling token first
router.get('/', controller.homePage);

// Upload Routes
router.get('/upload', controller.uploadPage);
router.post('/upload', upLoadImages(), controller.uploadPage);


module.exports = router;