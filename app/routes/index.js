// importation des modules pour le router
const express = require('express');
const router = express.Router();

// Imports of the main router
const mainRouter = require('./mainRouter');

router.use((req, res, next) => {
    console.log('Request reçu dans index du router: ' + req.url);
    next();
})

// router.use(express.json());
// router.use(express.urlencoded({ extended: true }));

// Appel aux routeurs secondaires
router.use('/imagesApp/imagesApp', express.json(), mainRouter);
router.use('/imagesApp', express.json(), mainRouter);
router.use('/', express.json(), mainRouter);

module.exports = router;