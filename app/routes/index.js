// importation des modules pour le router
const express = require('express');
const router = express.Router();

// Imports of the main router
const mainRouter = require('./mainRouter');

// Appel aux routeurs secondaires
router.use('/imagesApp/imagesApp', mainRouter);
router.use('/imagesApp', mainRouter);
router.use('/', mainRouter);

module.exports = router;