const { readdir } = require('fs');
const path = require('path');
const fs = require('fs');

// json File to register all the images
let imageSource;
const extensionAccepted = ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG'];

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
                .map(dirent => dirent.name);

            imageNames.forEach((img) => {
                const extension = img.split('.')[1];
                if (extensionAccepted.indexOf(extension) != -1) {
                    // extension accepted

                    // ! calculate binary data for the image and add it as a property

                    // ! lets look if binary number already exist
                    // ! if yes then delete file

                    // lets look if image name already exist
                    const isImg = imageSource.find((imgSearched) => {
                        // console.log(img, imgSearched.fileName);
                        return img == imgSearched.fileName
                    });
                    if (isImg) {
                        // ! do not delete file but rename it with a random number
                        // ! keep track of the new fileName and push it to array
                        // delete the duplicate file
                        const sourceDuplicate = `${source}/${img}`;
                        fs.unlinkSync(sourceDuplicate);
                    } else {
                        imageSource.push({ fileName: img, year: year })
                    }
                }
            });

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
const source = path.normalize(`${__dirname}/../../../../pictures/2019`);

getFiles(source, '2019');


