
const compareImages = require("resemblejs/compareImages");
const fs = require("mz/fs");

/**
 * @param {string} imgUrl1 
 * @param {string} imgUrl2 
 */
async function compare(imgUrl1, imgUrl2) {
    const options = {
        output: {
            errorColor: {
                red: 255,
                green: 0,
                blue: 255
            },
            errorType: "movement",
            transparency: 0.3,
            largeImageThreshold: 1200,
            useCrossOrigin: false,
            // outputDiff: true
        },
        scaleToSameSize: true,
        ignore: "antialiasing"
    };

    const data = await compareImages(await fs.readFile(imgUrl1), await fs.readFile(imgUrl2), options);
    const parsedName = imgUrl2.split('screenshots/')[1];
    console.log(parsedName,imgUrl2);
    await fs.writeFile(`diffs/${parsedName}`, data.getBuffer());
}

module.exports = compare;