// imports modules for Router
const express = require('express');
const router = express.Router();
const auth = require('./middlewares/auth');
const controller = require('./controller');

// Route for welcoming page - controling token first
router.get('/', controller.homePage);
router.get('/upload', controller.uploadPage);


module.exports = router;