const utils = {}

utils.flaggedSamples = [40, 69, 72, 67, 74, 78, 79, 75, 76, 82, 103, 102, 101, 100, 99, 97, 104, 121, 124, 128, 153, 189, 188, 187, 186, 191, 197, 217, 221, 223, 239, 237, 238, 245, 249, 265, 266, 269, 285, 305, 310, 307, 308, 333, 339, 331, 354, 381, 380, 379, 377, 382, 383, 385, 388, 386, 387, 389, 390, 391, 423, 424, 421, 420, 435, 436, 437, 438, 439, 440, 433, 434, 463, 458, 493, 525, 559, 554, 562, 561, 564, 565, 567, 568, 566, 563, 570, 582, 579, 580, 578, 581, 605, 607, 606, 603, 608, 615, 610, 637, 650, 649, 653, 652, 659, 658, 657, 660, 661, 669, 668, 671, 670, 672, 694, 692, 690, 689, 706, 705, 711, 695, 714, 713, 715, 716, 719, 732, 805, 804, 803, 802, 801, 842, 849, 890, 893, 892, 895, 894, 896, 1361, 1362, 1363, 1364, 1365, 1366, 1367, 1352, 1351, 1349, 1426, 1425, 1427, 1428, 1429, 1430, 1431, 1432, 1487, 1486, 1481, 1482, 1492, 1506, 1587, 1611, 1610, 1609, 1612, 1627, 1630, 1801, 1804, 1805, 1858, 1889, 1891, 1930, 1937, 1938, 1945, 1958, 1962, 1969, 2603, 2601, 2602, 2849, 2850, 2853, 2851, 2852, 2856, 2855, 2854, 2865, 2867, 2868, 2870, 2871, 2873, 2904, 2902, 2930, 2933, 2942, 2939, 2950, 2958, 2981, 3010, 3018, 3045, 3046, 3043, 3044, 3048, 3085, 3083, 3082, 3081, 3084, 3086, 3087, 3088, 3114, 3138, 3137, 3159, 3377, 3378, 3381, 3382, 3383, 3384, 3399, 3400, 3422, 3430, 3426, 3425, 3427, 3419, 3418, 3537, 3538, 3539, 3540, 3541, 3542, 3543, 3544, 3533, 3569, 3581, 3588, 3587, 3593, 3689, 3698, 3699, 3697, 3701, 3700, 3692, 3694, 3703, 3704, 3702, 3714, 3732, 3734, 3813, 3818, 3817, 3819, 3824, 3823, 3837, 3845, 3844, 3834, 3846, 3853, 3854, 3851, 3858, 3861, 3862, 3863, 3859, 3875, 3873, 3876, 3878, 3880, 5716, 5687, 5675, 5676, 5677, 5678, 5659, 5651, 5634, 5577, 5585, 5513, 5514];

utils.styles = {
    'car': { 'color': 'gray', 'text': '🏎️' },
    'fish': { 'color': 'red', 'text': '🐟' },
    'house': { 'color': 'yellow', 'text': '🏠' },
    'tree': { 'color': 'green', 'text': '🌴' },
    'bicycle': { 'color': 'cyan', 'text': '🚲' },
    'guitar': { 'color': 'brown', 'text': '🎸' },
    'pencil': { 'color': 'magenta', 'text': '🖋️' },
    'clock': { 'color': 'lightgray', 'text': '🕐' }
};

utils.styles["?"] = { 'color': 'red', 'text': '❓' };

// return the % amount
/**
 * 
 * @param {number} n 
 * @returns {string}
 */
utils.formatPercent = (n) => {
    return (n * 100).toFixed(2) + "%";
};

/**
 * @description Print the progress
 * @param {number} count 
 * @param {number} max 
 */
utils.printProgress = (count, max) => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    const percent = utils.formatPercent(
        count / max
    );
    process.stdout.write(count + "/" + max + "(" + percent + ")");
};

/**
 * @description Group the data bases on the common attribute
 * @param {Array} objArray 
 * @param {string} key 
 * @returns {Object}
 */
utils.groupBy = (objArray, key) => {
    const groups = {};

    for (let obj of objArray) {
        const val = obj[key];
        if (groups[val] == null) {
            groups[val] = [];
        };
        groups[val].push(obj);
    }

    return groups;
}

/**
 * @description Calculate the Euclidean Distance
 * @param {number} p1 
 * @param {number} p2 
 * @returns {number}
 */
utils.distance = (p1, p2) => {
    return Math.sqrt(
        (p1[0] - p2[0]) ** 2 +
        (p1[1] - p2[1]) ** 2
    );
}

/**
 * @description Get the nearest K neighbours based on the Euclidean distance
 * @param {number[]} loc 
 * @param {number[]} points 
 * @param {number} k 
 * @returns 
 */
utils.getNearest = (loc, points, k = 1) => {
    const obj = points.map((val, idx) => { return { idx, val } });
    const sorted = obj.sort((a, b) => {
        // based on the condition
        return utils.distance(loc, a.val) - utils.distance(loc, b.val);
    });
    // collecte all the indices after the sorting
    const indices = sorted.map((obj) => obj.idx);
    // return first K indices
    return indices.slice(0, k);
};

/**
 * @description Calculate the value of point
 * @param {number} a 
 * @param {number} b 
 * @param {number} v 
 * @returns {number}
 */
utils.invLerp = (a, b, v) => {
    return (v - a) / (b - a);
};

/**
 * @description Normalize the points
 * @param {number[]} points 
 * @param {{min, max}} minMax 
 * @returns {{min, max}}
 */
utils.normalizePoints = (points, minMax) => {
    let min, max;
    const dimensions = points[0].length;

    if (minMax) {
        min = minMax.min,
            max = minMax.max
    } else {
        min = [...points[0]];
        max = [...points[1]];

        for (let i = 1; i < points.length; i++) {
            for (let j = 0; j < dimensions; j++) {
                min[j] = Math.min(min[j], points[i][j]);
                max[j] = Math.max(max[j], points[i][j]);
            };
        };
    }

    for (let i = 0; i < points.length; i++) {
        for (let j = 0; j < dimensions; j++) {
            points[i][j] = utils.invLerp(min[j], max[j], points[i][j]);
        }
    }

    return { min, max };
};

/**
 * @description Convert data to CSV file
 */
utils.toCSV = (headers, samples) => {
    let str = headers.join(",") + "\n";
    for (const sample of samples) {
        str += sample.join(",") + "\n";
    };
    return str;
};

if (typeof module != 'undefined') {
    module.exports = utils;
};