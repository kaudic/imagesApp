const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const { readdir } = require('fs');
const blockhash = require("blockhash-core");
const { imageFromBuffer, getImageData } = require("@canvas/image");
const imageDataMapper = require('../models/image');

const utils = {

    readAndReturnCredentials: () => {
        // we will read the password, login, and token secret from the .env file of the audisServerConsole project
        const pathToCredentials = path.normalize(`${__dirname}/../../../audicServerConsole/.env`);
        const fileText = fs.readFile(pathToCredentials, 'utf8', (err, data) => {
            const textArray = data.split('\r').map((x) => x.replace('\n', ''));
            let login, password, accessTokenSecret;
            textArray.forEach((text) => {
                if (text.startsWith('LOGIN')) { login = text.replace('LOGIN=', '') };
                if (text.startsWith('PASSWORD')) { password = text.replace('PASSWORD=', '') };
                if (text.startsWith('ACCESS_TOKEN_SECRET')) { accessTokenSecret = text.replace('ACCESS_TOKEN_SECRET=', '') };
            });
            console.log(login, password, accessTokenSecret);
            return ({ login, password, accessTokenSecret });
        });

    },
    // function to hash an image
    hash: async (imgPath) => {
        try {
            const data = await utils.readFileHash(imgPath);
            const hash = await blockhash.bmvbhash(getImageData(data), 8);
            return utils.hexToBin(hash);
        } catch (error) {
            console.log(error.message, imgPath);
        }
    },
    // function used in hash function
    hexToBin: (hexString) => {
        const hexBinLookup = {
            0: "0000",
            1: "0001",
            2: "0010",
            3: "0011",
            4: "0100",
            5: "0101",
            6: "0110",
            7: "0111",
            8: "1000",
            9: "1001",
            a: "1010",
            b: "1011",
            c: "1100",
            d: "1101",
            e: "1110",
            f: "1111",
            A: "1010",
            B: "1011",
            C: "1100",
            D: "1101",
            E: "1110",
            F: "1111",
        };
        let result = "";
        for (i = 0; i < hexString.length; i++) {
            result += hexBinLookup[hexString[i]];
        }
        return result;
    },
    // function to readFileAndHash using previous function
    readFileHash: (path) => {
        return new Promise((resolve, reject) => {
            fs.readFile(path, (err, data) => {
                if (err) reject(err);
                resolve(imageFromBuffer(data));
            });
        });
    },
    // it will calculate hash for images and delete files if hash is already in DB
    filterFilesBeforeInsertInDb: (tempPath, imagesPath, year = null, socket) => {

        return new Promise(async (resolve, reject) => {

            // SELECT all fingerprints from DB and load them in currentFingerPrints
            const currentFingerPrints = await imageDataMapper.getAllFingerPrints();
            const imagesToInsert = [];

            // Read the top folder
            readdir(tempPath, { withFileTypes: true }, async (err, files) => {
                if (err) {
                    console.log(err)
                } else {

                    // Read the files names and put it in an array imageNames
                    const imageNames = files
                        .filter(dirent => !dirent.isDirectory())
                        .map(dirent => dirent.name);

                    // Loop on the array imageNames and calculate hash(fingerorints) and compare to existing fingerprints
                    for await (const img of imageNames) {
                        const sourceFile = `${tempPath}/${img}`;

                        try {
                            // calculate fingerPrints
                            const fingerPrints = await utils.hash(sourceFile);
                            if (fingerPrints === undefined) {
                                socket.emit('upload', `deleting file because Hash not calculable ${sourceFile}`);
                                console.log('DELETING FILE BECAUSE PB HASH: ' + sourceFile);
                                fs.unlinkSync(sourceFile);
                            } else {
                                // lets look if binary number already exist - if yes then delete file
                                const isBinary = currentFingerPrints.find((imgSearched) => {
                                    return fingerPrints == imgSearched.fingerprints
                                });
                                if (isBinary) {

                                    // deleting file as it is the same image
                                    socket.emit('upload', `deleting file because it is a duplicate ${sourceFile}`);
                                    console.log('DELETING FILE DUPLICATES: ' + sourceFile);
                                    fs.unlinkSync(sourceFile);
                                }
                                else {
                                    // move file to images folder
                                    fs.rename(sourceFile, `${imagesPath}/${img}`, (err) => {
                                        if (err) throw err;
                                        socket.emit('upload', `moving file from temp to final folder`);
                                        console.log('File moved from Temp folder to images folder');
                                    });
                                    imagesToInsert.push({ fileName: img, year: year, fingerPrints: fingerPrints });
                                }
                            }
                        }
                        catch (err) {
                            console.log(err.message, img);
                        }
                    }

                    resolve(imagesToInsert);
                }
            });










        })


    }
};

module.exports = utils;