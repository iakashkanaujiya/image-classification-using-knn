if(typeof utils === 'undefined'){
    utils = require("../utils");
};

class KNN{
    constructor(samples, k){
        this.samples = samples;
        this.k = k;
    };
    /**
     * @description Predict
     * @param {[]} points 
     * @returns 
     */
    predict(points){
        const samplePoints = this.samples.map(s => s.points);

        const indices = utils.getNearest(points, samplePoints, this.k);
        const nearestSamples = indices.map(i => this.samples[i]);
        const labels = nearestSamples.map(s => s.label);

        // Count the number of label occured
        let counts = {}
        for (const label of labels) {
            counts[label] = counts[label] ? counts[label] + 1 : 1;
        };

        // find majority label 
        const max = Math.max(...Object.values(counts));
        const label = labels.find(l => counts[l] == max);

        return { label, nearestSamples };
    };
};

if(typeof module != 'undefined'){
    module.exports = KNN;
};