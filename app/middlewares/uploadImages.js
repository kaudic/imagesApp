const multer = require('multer');
const path = require('path');
const fs = require('fs');

// function to return the path to the images folder in the audicServer
const returnImagesFolderPath = () => {
    const pathToImagesFolder = path.normalize(`${__dirname}/../../../../images`);
    console.log('images folder path: ' + pathToImagesFolder);
    return pathToImagesFolder;
}

//usine à middleware. Dans le return de la fonction je retourne le middleware fournit par multer.
const upLoadImages = (files) => {

    console.log('multer got one file : ' + files);

    const storage = multer.diskStorage({
        destination: returnImagesFolderPath(),

        filename: (req, file, callback) => {
            callback(null, file.originalname);
        }

    });

    const fileFilter = (req, file, callback) => {

        const extension = file.originalname.split('.')[1];
        const extensionAccepted = ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG'];

        if (extensionAccepted.indexOf(extension) === -1) {

            console.log(`extension ${extension} n'est pas autorisée.`)
            callback(null, false);
        }
        else {
            callback(null, true);

        }
    };

    return multer({ storage: storage, fileFilter: fileFilter }).array('uploadInput');
};

module.exports = upLoadImages;