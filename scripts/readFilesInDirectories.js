const { readdir } = require('fs');
const path = require('path');
const fs = require('fs');
const blockhash = require("blockhash-core");
const { imageFromBuffer, getImageData } = require("@canvas/image");

// function to hash an image
async function hash(imgPath) {
    try {
        const data = await readFileHash(imgPath);
        const hash = await blockhash.bmvbhash(getImageData(data), 8);
        return hexToBin(hash);
    } catch (error) {
        console.log(error.message, imgPath);
    }
}

// function used in hash function
function hexToBin(hexString) {
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
}

// function to readFileAndHash using previous function
function readFileHash(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) reject(err);
            resolve(imageFromBuffer(data));
        });
    });
}

// json File to register all the images
let imageSource = [];
const extensionAccepted = ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG'];

// Script 1 (fileName and Year)
const getFiles = async (source, year) => {
    // Read the original json
    // imageSource = require('../data/imagesSource.json');

    // Read the top folder
    readdir(source, { withFileTypes: true }, async (err, files) => {
        if (err) {
            console.log(err)
        } else {

            // push image Names in the array imageSource
            const imageNames = files
                .filter(dirent => !dirent.isDirectory())
                .map(dirent => dirent.name);

            // const echantillon = [];
            // for (let i = 50; i < 55; i++) {
            //     echantillon.push(imageNames[i])
            // }

            // console.log(imageNames);
            // console.log(echantillon);

            for await (const img of imageNames) {
                const extension = img.split('.')[1];
                if (extensionAccepted.indexOf(extension) != -1) {
                    // extension accepted
                    let sourceFile = `${source}/${img}`;

                    try {
                        // calculate fingerPrints
                        const fingerPrints = await hash(sourceFile);
                        if (fingerPrints === undefined) {
                            console.log('DELETING FILE PB HASH: ' + sourceFile + '---' + fingerPrints);
                            // if hash doesn't work I want to delete file
                            fs.unlinkSync(sourceFile);
                        } else {
                            // lets look if image name already exist
                            const isImg = imageSource.find((imgSearched) => {
                                // console.log(img, imgSearched.fileName);
                                return img == imgSearched.fileName
                            });

                            if (isImg) {
                                // generate a new File name with random number and then rename file
                                const randomNumber = Math.floor((Math.random() * 1000));
                                const newFileName = img.split('.')[0] + randomNumber + '.' + img.split('.')[1]
                                const newSource = `${source}/${newFileName}`;
                                fs.rename(sourceFile, newSource, (err) => {
                                    console.log(`Rename: ${sourceFile}->${newSource}`);
                                    if (err) throw err;
                                });
                                sourceFile = newSource;
                            }
                            // lets look if binary number already exist - if yes then delete file
                            const isBinary = imageSource.find((imgSearched) => {
                                return fingerPrints == imgSearched.fingerPrints
                            });

                            if (isBinary && isBinary.fingerPrints != undefined) {
                                // deleting file as it is the same image
                                console.log('DELETING FILE DUPLICATES: ' + sourceFile + '---' + isBinary.fileName);

                                fs.unlinkSync(sourceFile);
                            }
                            else {
                                imageSource.push({ fileName: img, year: year, fingerPrints: fingerPrints });
                            }

                        }

                    }
                    catch (err) {
                        console.log(err.message, img);
                    }
                }
            }

            // read subDirectories
            const dirNames = files
                .filter(dirent => dirent.isDirectory())
                .map(dirent => dirent.name)
            dirNames.forEach((dirName) => {
                getFiles(`${source}/${dirName}`, year);
            });

            // write in data repo
            const repoPath = path.normalize(`${__dirname}/../data/images${year}.json`);
            // console.log('writing in json file');
            fs.writeFileSync(repoPath, JSON.stringify(imageSource));

        }

    });
}

// Start the script
// ! change year in the source
const source = path.normalize(`${__dirname}/../../../../pictures/2016`);
// ! change year here
getFiles(source, '2016');


