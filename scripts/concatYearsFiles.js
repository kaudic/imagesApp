const path = require('path');
const fs = require('fs');

// json File to register all the images
let concatJson = [];

const image2006 = require('../data/images2006.json');
const image2007 = require('../data/images2007.json');
const image2008 = require('../data/images2008.json');
const image2009 = require('../data/images2009.json');
const image2010 = require('../data/images2010.json');
const image2011 = require('../data/images2011.json');
const image2012 = require('../data/images2012.json');
const image2013 = require('../data/images2013.json');
const image2014 = require('../data/images2014.json');
const image2015 = require('../data/images2015.json');
const image2016 = require('../data/images2016.json');
const image2017 = require('../data/images2017.json');
const image2018 = require('../data/images2018.json');
const image2019 = require('../data/images2019.json');
const image2020 = require('../data/images2020.json');
const image2021 = require('../data/images2021.json');

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
const repoPath = path.normalize(`${__dirname}/../data/final/years.json`);
fs.writeFileSync(repoPath, JSON.stringify(concatJson));

console.log('File written, numbers of images: ' + concatJson.length);