if (typeof geometry === 'undefined') {
    geometry = require("./geomatry");
};

if (typeof draw === 'undefined') {
    draw = require("./draw");
};

const featureFunction = {}

// count the totalpaths
featureFunction.getPathCount = (paths) => {
    return paths.length;
};

// count total points
featureFunction.getPointsCount = (paths) => {
    const points = paths.flat();
    return points.length;
};

/**
 * @description Get the width
 */
featureFunction.getWidth = (paths) => {
    const points = paths.flat();
    const x = points.map(p => p[0]);
    const min = Math.min(...x);
    const max = Math.max(...x);
    return max - min;
};

/**
 * @description Get the height 
 */
featureFunction.getHeight = (paths) => {
    const points = paths.flat();
    const y = points.map(p => p[1]);
    const min = Math.min(...y);
    const max = Math.max(...y);
    return max - min;
};

/**
 * @description Get elongation
 * @param {*} paths 
 * @returns 
 */
featureFunction.getElongation = (paths) => {
    const points = paths.flat();
    const { width, height } = geometry.minimumBoundingBox({ points });
    return (Math.max(width, height) + 1) / (Math.min(width, height) + 1);
};

/**
 * @description Get roundness
 * @param {*} paths 
 * @returns 
 */
featureFunction.getRoundness = (paths) => {
    const points = paths.flat();
    const { hull } = geometry.minimumBoundingBox({ points });
    return geometry.roundness(hull);
};

/**
 * @description get all image pixels
 * @param {*} paths 
 * @param {*} size 
 * @param {*} expand 
 * @returns 
 */
featureFunction.getPixels = (paths, size = 400, expand = true) => {
    let canvas = null;

    try {
        // for web
        canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
    } catch (err) {
        // for node
        const { createCanvas } = require("../node/node_modules/canvas");
        canvas = createCanvas(size, size);
    }

    const ctx = canvas.getContext("2d");

    if(expand){
        const points = paths.flat();

        const bounds = {
            left: Math.min(...points.map(p => p[0])),
            right: Math.max(...points.map(p => p[0])),
            top: Math.min(...points.map(p => p[1])),
            bottom: Math.max(...points.map(p => p[1]))
        };

        const newPaths = [];

        for(const path of paths){
            const newPoints = path.map(p => [
                utils.invLerp(bounds.left, bounds.right, p[0]) * size,
                utils.invLerp(bounds.top, bounds.bottom, p[1]) * size
            ]);
            newPaths.push(newPoints);
        };

        draw.paths(ctx, newPaths);
    } else {
        draw.paths(ctx, paths);
    }

    const imgData = ctx.getImageData(0, 0, size, size);

    //take out alpha values
    return imgData.data.filter((val, idx) => idx % 4 == 3);
};

/**
 * @description Count total number of pixels
 * @param {*} paths 
 * @returns 
 */
featureFunction.getComplexity = (paths) => {
    const pixels = featureFunction.getPixels(paths);
    return pixels.filter((a) => a != 0).length;
};

featureFunction.inUse = [
    // { name: "Path Count", function: featureFunction.getPathCount },
    // { name: "Point Count", function: featureFunction.getPointsCount },
    { name: "Width", function: featureFunction.getWidth },
    { name: "Height", function: featureFunction.getHeight },
    { name: "Elongation", function: featureFunction.getElongation },
    { name: "Roundness", function: featureFunction.getRoundness },
    { name: "Complexity", function: featureFunction.getComplexity }
];

if (typeof module != 'undefined') {
    module.exports = featureFunction;
};