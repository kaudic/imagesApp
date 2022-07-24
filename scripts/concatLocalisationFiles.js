const path = require('path');
const fs = require('fs');

// json File to register all the images
let concatJson = [];

const image2006 = require('../data/localisationAmsterdam.json');
const image2007 = require('../data/localisationBruges.json');
const image2008 = require('../data/localisationChine.json');
const image2009 = require('../data/localisationCyclades.json');
const image2010 = require('../data/localisationDublin.json');
const image2011 = require('../data/localisationDubrovnik.json');
const image2012 = require('../data/localisationKotor.json');
const image2013 = require('../data/localisationLaCroisic2.json');
const image2014 = require('../data/localisationLaRéunion.json');
const image2015 = require('../data/localisationLeCroisic.json');
const image2016 = require('../data/localisationLisbonne.json');
const image2017 = require('../data/localisationMalaisie.json');
const image2018 = require('../data/localisationParis.json');
const image2019 = require('../data/localisationPontAbbé.json');
const image2020 = require('../data/localisationPorto.json');
const image2021 = require('../data/localisationVenise.json');

concatJson.push(...image2006);
concatJson.push(...image2007);
concatJson.push(...image2008);
concatJson.push(...image2009);
concatJson.push(...image2010);
concatJson.push(...image2011);
concatJson.push(...image2012);
concatJson.push(...image2013);
concatJson.push(...image2014);
concatJson.push(...image2015);
concatJson.push(...image2016);
concatJson.push(...image2017);
concatJson.push(...image2018);
concatJson.push(...image2019);
concatJson.push(...image2020);
concatJson.push(...image2021);

// write in data repo
const repoPath = path.normalize(`${__dirname}/../data/final/localisations.json`);
fs.writeFileSync(repoPath, JSON.stringify(concatJson));

console.log('File written, numbers of images Localisation: ' + concatJson.length);