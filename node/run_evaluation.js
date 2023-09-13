const constants = require("../common/constants");
const utils = require("../common/utils");
const KNN = require("../common/classifiers/knn");
const fs = require('fs');

console.log("Running classification ...");

const { samples: trainingSamples } = JSON.parse(fs.readFileSync(constants.TRAINING));
const kNN = new KNN(trainingSamples, 50);

const { samples: testingSamples } = JSON.parse(fs.readFileSync(constants.TESTING));

/** Compute the accuracy */
let totalCount = 0, correctCount = 0;
for (const sample of testingSamples) {
    const { label: predictLabel } = kNN.predict(sample.points);
    correctCount += predictLabel == sample.label;
    totalCount++;
};


let dataToPrint = "Accuracy: " + correctCount + "/" + totalCount +
    " (" + utils.formatPercent(correctCount / totalCount) + ")"
console.log(dataToPrint);


/** Generate decision boundaries using canvas */
console.log("Generating decision boundaries ...");

const { createCanvas } = require("canvas");
const canvas = createCanvas(400, 400);
const ctx = canvas.getContext("2d");

for (let x = 0; x < canvas.width; x++) {
    for (let y = 0; y < canvas.height; y++) {
        const points = [x / canvas.width, 1 - y / canvas.height];
        const { label } = kNN.predict(points);
        const color = utils.styles[label].color;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
    };
};

const buffer = canvas.toBuffer("image/png");
fs.writeFileSync(constants.DECISION_BOUNDARY, buffer);

console.log("Done!");

