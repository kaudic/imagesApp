const { readdir } = require('fs');
const path = require('path');
const fs = require('fs');

// json File to register all the images
let imageSource;

// Script 1 (fileName and Year)
const getFiles = (source, year) => {
    // Read the original json
    imageSource = require('../data/imagesSource.json');

    // Read the top folder
    readdir(source, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.log(err)
        } else {

            // push image Names in the array imageSource
            const imageNames = files
                .filter(dirent => !dirent.isDirectory())
                .map(dirent => dirent.name)
            imageNames.forEach((img) => imageSource.push({ fileName: img, year: year }));

            // read subDirectories
            const dirNames = files
                .filter(dirent => dirent.isDirectory())
                .map(dirent => dirent.name)
            dirNames.forEach((dirName) => {
                getFiles(`${source}/${dirName}`, year);
            });

        }
        // write in data repo
        const repoPath = path.normalize(`${__dirname}/../data/imagesSource.json`);
        fs.writeFileSync(repoPath, JSON.stringify(imageSource));
    });
}

// Start the script
const source2 = path.normalize(`${__dirname}/../../../../pictures/2019`);

getFiles(source, '2019');


