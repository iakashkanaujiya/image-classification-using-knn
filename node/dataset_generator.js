const draw = require("../common/draw");
const constants = require("../common/constants.js");
const utils = require("../common/utils");

/**
 * Create new Canvas
 */
const { createCanvas } = require("canvas");
const canvas = createCanvas(400, 400);
const ctx = canvas.getContext("2d");

/** File System Utils */
const fs = require("fs");
const featureFunction = require("../common/featureFunction");

const fileNames = fs.readdirSync(constants.RAW_DIR);
const samples = [];
let id = 1;

fileNames.forEach(fn => {
    const content = fs.readFileSync(
        constants.RAW_DIR + "/" + fn
    );
    const { session, student, drawings } = JSON.parse(content);

    for (let label in drawings) {
        if (!utils.flaggedSamples.includes(id)) {
            samples.push({
                id,
                label,
                student_name: student,
                student_id: session
            });

            const paths = drawings[label];
            fs.writeFileSync(
                constants.JSON_DIR + "/" + id + ".json",
                JSON.stringify(paths)
            );

            //generate image file
            generateImageFile(constants.IMG_DIR + "/" + id + ".png", paths);
        };

        utils.printProgress(id, fileNames.length * 8);

        id++;
    };
});

fs.writeFileSync(constants.SAMPLES, JSON.stringify(samples));
fs.writeFileSync(constants.SAMPLES_JS, "const samples = " + JSON.stringify(samples) + ";");

function generateImageFile(outFile, paths) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw.paths(ctx, paths);

    // const { vertices, hull } = geometry.minimumBoundingBox({ points: paths.flat() });
    // const roundness = geometry.roundness(hull);
    // draw.path(ctx, [...vertices, vertices[0]], "red"); // comment further

    // const R = Math.floor(roundness * 255);
    // const G = 0;
    // const B = Math.floor((1 - roundness) * 255);
    // const color = `rgb(${R}, ${G}, ${B})`;

    // draw.path(ctx, [...hull, hull[0]], color, 10);

    const pixels = featureFunction.getPixels(paths);
    const size = Math.sqrt(pixels.length);
    const imgData = ctx.getImageData(0, 0, size, size);

    for (let i = 0; i < pixels.length; i++) {
        const alpha = pixels[i];
        const startIndex = i * 4;

        imgData.data[startIndex] = 0;
        imgData.data[startIndex + 1] = 0;
        imgData.data[startIndex + 2] = 0;
        imgData.data[startIndex + 3] = alpha;
    }

    ctx.putImageData(imgData, 0, 0);

    // const complexity = pixels.filter((a) => a != 0).length;
    // draw.text(ctx, complexity, "blue");

    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(outFile, buffer);
};