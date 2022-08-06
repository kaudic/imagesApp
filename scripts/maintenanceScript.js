// function will check that files in directory well sync with DB info - if not unlink files

// modules
const path = require('path');
const fs = require('fs');
const { readdir } = require('fs');

// get the client
require('dotenv').config();

// get Datamapper
const imageDataMapper = require('../app/models/image');


function maintenanceScript() {
    console.log('starting maintenance programm to make sure physical images and database info are equals');

    // calculate temp path and images path to give to utils function
    const directoryPath = path.normalize(`${__dirname}/../public/assets/images`);
    console.log('production Server directory: ' + directoryPath);

    readdir(directoryPath, { withFileTypes: true }, async (err, files) => {
        if (err) {
            console.log(err)
        } else {
            // Read the files names and put it in an array imageNames
            const physicalImageNames = files
                .filter(dirent => !dirent.isDirectory())
                .map(dirent => dirent.name);
            console.log(`There are ${physicalImageNames.length} files on the server`);

            // Get the file names from the database
            const databaseFilenames = await imageDataMapper.getAllFilenames();
            console.log(`There are ${databaseFilenames.length} files on the database`);

            // Compare the 2 and if not equal then launch the maintenance = delete physical files
            let counter = 0;
            if (databaseFilenames.length != physicalImageNames.length) {
                console.log('Results are not equal, launching maintenance program');

                if (physicalImageNames.length > databaseFilenames.length) {
                    for (const physicalFile of physicalImageNames) {
                        const isFileInDB = databaseFilenames.find((DBfile) => {
                            // console.log(`DBFile: ${DBfile.file_name}`, `physicalFile: ${physicalFile}`);
                            return DBfile.file_name == physicalFile
                        });

                        if (!isFileInDB) {
                            counter++;
                            const physicalFilePath = directoryPath + `/${physicalFile}`;
                            fs.unlinkSync(physicalFilePath);
                        }
                    }
                    console.log(`Le programme a supprimé ${counter} fichiers sur le serveur.`)
                } else {
                    for (const DBfile of databaseFilenames) {
                        const isFilePhysical = physicalImageNames.find((physicalFile) => {
                            // console.log(`DBFile: ${DBfile.file_name}`, `physicalFile: ${physicalFile}`);
                            return DBfile.file_name == physicalFile
                        });

                        if (!isFilePhysical) {
                            counter++;
                            imageDataMapper.deleteImageByFilename(DBfile.file_name);
                        }
                    }
                    console.log(`Le programme a supprimé ${counter} enregistrements de la BDD.`);
                }

            }
        }
        process.exit();
    });

};

process.on('message', (message) => {
    if (message == 'START') {
        maintenanceScript();
    }
});




