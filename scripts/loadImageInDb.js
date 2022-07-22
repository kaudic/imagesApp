const { readdir } = require('fs');
const path = require('path');

const getDirectories = (source) =>
    readdir(source, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.log(err)
        } else {
            const newDirectoryFileName = files
                .filter(dirent => dirent.isDirectory())
                .map(dirent => dirent.name)

            console.log(newDirectoryFileName);

        }
    });

const source = path.normalize(`${__dirname}/../../images`);
console.log(source);
getDirectories(source);




// Read directory to get all the images names



// Insert all in PG