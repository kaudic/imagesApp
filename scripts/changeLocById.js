const path = require('path');
const fs = require('fs');

// json File to register all the images

const localisationById = require('../data/final/localisations.json');

localisationById.forEach((img) => {

    switch (img.localisation) {
        case 'Malaisie': img.localisation = 1;
            break;
        case 'Le Croisic': img.localisation = 3;
            break;
        case 'La Croisic': img.localisation = 3;
            break;
        case 'Grèce': img.localisation = 4;
            break;
        case 'Cyclades': img.localisation = 4;
            break;
        case 'Amsterdam': img.localisation = 5;
            break;
        case 'Bruges': img.localisation = 6;
            break;
        case 'Chine': img.localisation = 7;
            break;
        case 'Dublin': img.localisation = 8;
            break;
        case 'Dubrovnik': img.localisation = 9;
            break;
        case 'Kotor': img.localisation = 10;
            break;
        case 'La Réunion': img.localisation = 11;
            break;
        case 'Lisbonne': img.localisation = 12;
            break;
        case 'Paris': img.localisation = 13;
            break;
        case 'Pont l\'Abbé': img.localisation = 14;
            break;
        case 'Porto': img.localisation = 15;
            break;
        case 'Venise': img.localisation = 16;
            break;
    }

});

// write in data repo
const repoPath = path.normalize(`${__dirname}/../data/final/localisationsById.json`);
fs.writeFileSync(repoPath, JSON.stringify(localisationById));

console.log('File written, numbers of images Localisation: ' + localisationById.length);