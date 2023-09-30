const constants = require("../common/constants");
const featureFunction = require("../common/featureFunction");
const utils = require("../common/utils");
const fs = require("fs");

console.log("Extracting features ...");

// Read all the samples
const samples = JSON.parse(fs.readFileSync(constants.SAMPLES));

for (let i=0; i<samples.length; i++) {
    const sample = samples[i];
    // read the path from the data/dataset/json
    const paths = JSON.parse(
        fs.readFileSync(constants.JSON_DIR + "/" + sample.id + ".json")
    );

    const functions = featureFunction.inUse.map(f => f.function);
    sample.points = functions.map(f => f(paths));

    utils.printProgress(i, samples.length);
};

// take out all the features
const featuresNames = featureFunction.inUse.map(f => f.name);

console.log("Generating splits ...");
const trainingAmount = samples.length * 0.5;
const training = []
const testing = []

/**
 * @description Split the training and testing data
 */
for (let i = 0; i < samples.length; i++) {
    if (i < trainingAmount) {
        training.push(samples[i]);
    } else {
        testing.push(samples[i]);
    }
};

// normalize the points
// scaledown the points from 0 to 1
const minMax = utils.normalizePoints(training.map(s => s.points));
utils.normalizePoints(testing.map(s => s.points), minMax);

// features and samples
fs.writeFileSync(constants.FEATURES, JSON.stringify({ featuresNames, samples }));
fs.writeFileSync(constants.FEATURES_JS, `const features = ${JSON.stringify({ featuresNames, samples })}`);
// training CSV
fs.writeFileSync(constants.TRAINING_CSV, utils.toCSV(
    [...featuresNames, "Label"],
    training.map(a => [...a.points, a.label]))
);
// testing csv
fs.writeFileSync(constants.TESTING_CSV, utils.toCSV(
    [...featuresNames, "Label"],
    testing.map(a => [...a.points, a.label]))
);

// Training
fs.writeFileSync(constants.TRAINING, JSON.stringify({ featuresNames, samples: training }));
fs.writeFileSync(constants.TRAINING_JS, `const training = ${JSON.stringify({ featuresNames, samples: training })}`);

//Testing
fs.writeFileSync(constants.TESTING, JSON.stringify({ featuresNames, samples: testing }));
fs.writeFileSync(constants.TESTING_JS, `const testing = ${JSON.stringify({ featuresNames, samples: testing })}`);

// Min and Max
fs.writeFileSync(constants.MIN_MAX_JS, `const minMax = ${JSON.stringify(minMax)}`);

console.log("Done!");

