/**
 * @description Display.js will display the data
 * @param {HTML} container 
 * @param {string} studentName 
 * @param {number[]} smaples 
 */

function createRow(container, studentName, smaples) {
    const row = document.createElement("div");
    row.classList.add("row");
    container.appendChild(row);

    // row label
    const rowLabel = document.createElement("div");
    rowLabel.innerHTML = studentName;
    rowLabel.classList.add("rowLabel");
    row.appendChild(rowLabel);

    // samples
    for (let sample of smaples) {
        const { id, label, student_id, correct } = sample;

        const sampleContainer = document.createElement("div");
        sampleContainer.id = "sample_" + id;
        sampleContainer.classList.add("sampleContainer");

        sampleContainer.onclick = (evt) => {
            if(evt.ctrlKey == true){
                toggleFlaggedSamples(sample);
            }else{
                handleClick(sample, false);
            }
        };


        if(correct == true){
            sampleContainer.style.backgroundColor = "blue";
        };

        const sampleLabel = document.createElement("div");
        sampleLabel.innerHTML = label;
        sampleContainer.appendChild(sampleLabel);

        const img = document.createElement("img");
        img.src = constants.IMG_DIR + "/" + id + ".png";
        img.classList.add("thumb");
        sampleContainer.appendChild(img);
        row.appendChild(sampleContainer);
    };
};

function handleClick(sample, doScroll = true) {
    if (sample == null) {
        //remove emphasize class from other elements
        [...document.querySelectorAll('.emphasize')].forEach(e => e.classList.remove('emphasize'));
        return;
    }

    const el = document.getElementById("sample_" + sample.id);
    if (el.classList.contains('emphasize')) {
        el.classList.remove('emphasize');
        chart.selectSample(null);
        return;
    }
    [...document.querySelectorAll('.emphasize')].forEach(e => e.classList.remove('emphasize'));
    el.classList.add("emphasize");
    if (doScroll) {
        el.scrollIntoView({ behavior: 'auto', block: 'center' });
    }
    chart.selectSample(sample);
}

function toggleInput() {
    if (inputContainer.style.display == "none") {
        inputContainer.style.display = "block";
    }else{
        inputContainer.style.display = "none";
        sketchPad.triggerUpdate();
    }
}