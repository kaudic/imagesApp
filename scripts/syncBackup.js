// This childprocess will check the backup usb stick directory and make sure it has a copy of all images
// it will also realize a dump of the database in usb stick

// modules
const path = require('path');
const fs = require('fs');
const { readdir } = require('fs');

// get the client
require('dotenv').config();

// function to do the backup
function syncBackup() {

    console.log('starting synchronize images folder with imagesBackup folder');
    const imagesFolderPath = path.normalize(`${__dirname}/../public/assets/images`);
    const imagesBackupPath = path.normalize(`${__dirname}/../../../../..//media/kaudic/65CB-F29E`);

    console.log('imagesFolderPath: ' + imagesFolderPath);
    console.log('imagesBackupPath: ' + imagesBackupPath);

    // Creating 2 empty arrays to load the files names of production server and backup folder
    let productionServerNames = [];
    let backupNames = [];

    // Reading both directories
    readdir(imagesFolderPath, { withFileTypes: true }, async (err, files) => {
        if (err) {
            console.log(err)
        } else {
            // Read the files names on the production server and put it in an array productionServerNames
            productionServerNames = files
                .filter(dirent => !dirent.isDirectory())
                .map(dirent => dirent.name);
            console.log(`There are ${productionServerNames.length} files on the server`);
        }


        readdir(imagesBackupPath, { withFileTypes: true }, async (err, files) => {
            if (err) {
                console.log(err)
            } else {
                // Read the files names on the backup folder and put it in an array backupNames
                backupNames = files
                    .filter(dirent => !dirent.isDirectory())
                    .map(dirent => dirent.name);
                console.log(`There are ${backupNames.length} files on the backup`);
            }

            // Delete files in backup that do not exist in production server
            let deleteCounter = 0;
            for (const backupImage of backupNames) {
                const isFileOnServer = productionServerNames.find((productionImg) => {
                    return backupImage == productionImg
                });

                if (!isFileOnServer) {
                    deleteCounter++;
                    const backupFilePathToDelete = imagesBackupPath + `/${backupImage}`;
                    console.log('deleting file: ' + backupFilePathToDelete);
                    fs.unlinkSync(backupFilePathToDelete);
                }
            }
            console.log(`La synchronisation a supprimé ${deleteCounter} fichiers du dossier backup`);


            // Copy file from production server in Backup folder if no exist
            let createCounter = 0;
            for (const productionImg of productionServerNames) {
                const isFileOnBackup = backupNames.find((backupImage) => {
                    return backupImage == productionImg
                });

                if (!isFileOnBackup) {
                    createCounter++;
                    const productionFilePathToCopy = imagesFolderPath + `/${productionImg}`;
                    const backupFilePathToCreate = imagesBackupPath + `/${productionImg}`;
                    console.log('copying file: ' + productionFilePathToCopy);
                    fs.copyFile(productionFilePathToCopy, backupFilePathToCreate, (err) => {
                        if (err) {
                            console.log("Error while copying file on backup folder:", err);
                            console.log("Error was on file: " + productionImg);
                        }
                    });
                }
            }
            console.log(`La synchronisation a créé ${createCounter} images dans le dossier backup`);
        });
    });
};

// launch the process
process.on('message', (message) => {
    if (message == 'START') {
        syncBackup();
    }
});