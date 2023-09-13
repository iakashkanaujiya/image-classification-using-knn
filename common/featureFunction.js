const featureFunction = {}

featureFunction.getPathCount = (paths) => {
    return paths.length;
};

featureFunction.getPointsCount = (paths) => {
    const points = paths.flat();
    return points.length;
};

featureFunction.getWidth = (paths) => {
    const points = paths.flat();
    const x = points.map(p => p[0]);
    const min = Math.min(...x);
    const max = Math.max(...x);
    return max - min;
};

featureFunction.getHeight = (paths) => {
    const points = paths.flat();
    const y = points.map(p => p[1]);
    const min = Math.min(...y);
    const max = Math.max(...y);
    return max - min;
};

featureFunction.inUse = [
    // { name: "Path Count", function: featureFunction.getPathCount },
    // { name: "Point Count", function: featureFunction.getPointsCount },
    { name: "Width", function: featureFunction.getWidth },
    { name: "Height", function: featureFunction.getHeight },
];

if (typeof module != 'undefined') {
    module.exports = featureFunction;
}