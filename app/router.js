// imports modules for Router
const express = require('express');
const router = express.Router();
const auth = require('./middlewares/auth');
const controller = require('./controller');

// Route for welcoming page - controling token first
router.get('/', auth, controller.homePage);

// Route for Logging in
router.post('/', controller.loggIn);

module.exports = router;