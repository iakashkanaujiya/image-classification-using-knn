class SketchPad {
    constructor(container, onUpdate=null, size = 400) {
        this.canvas = document.createElement("canvas");
        this.canvas.width = size;
        this.canvas.height = size;
        this.canvas.style = `
            background-color: #fff;
            box-shadow: 0px 0px 10px 2px #000;
            border: 5px solid rgb(255, 166, 0);
        `;
        // add canvas to the container
        container.appendChild(this.canvas);
        
        //UNDO functionality
        const lineBreak = document.createElement("br");
        container.appendChild(lineBreak);
        // add the undo btn
        this.undoBtn = document.createElement("button");
        this.undoBtn.innerHTML = "Revert";
        this.undoBtn.disabled = true;
        container.appendChild(this.undoBtn);

        // canvas context
        this.ctx = this.canvas.getContext('2d');
        this.onUpdate = onUpdate;

        this.reset();
        this.#addEventListner();
    };

    //resert the drawing path
    reset() {
        this.paths = [];
        this.isDrawing = false;
        /** Redraw everything */
        this.#rendraw();
    };

    // event listners
    #addEventListner() {
        this.canvas.onpointerdown = (event) => {
            const mouse = this.#getMouseLocation(event);
            this.paths.push([mouse]);
            this.isDrawing = true;
        };

        this.canvas.onpointermove = (event) => {
            //only if it is drawing
            if (this.isDrawing){
                const mouse = this.#getMouseLocation(event);
                const lastPath = this.paths[this.paths.length - 1];
                lastPath.push(mouse);
                this.#rendraw();
            }
        };

        document.onpointerup = () => {
            this.isDrawing = false;
        };

        //for touch device
        this.canvas.ontouchstart = (event) => {
            const loc = event.touches[0];
            this.canvas.onmousedown(loc);
        }

        this.canvas.ontouchmove = (event) => {
            const loc = event.touches[0];
            this.canvas.onmousemove(loc);
        }

        document.ontouchend = () => {
            document.onmouseup();
        }

        //UNDO
        this.undoBtn.onclick = () => {
            this.paths.pop();
            this.#rendraw();
        }
    }

    //render the drawing
    #rendraw(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        draw.paths(this.ctx, this.paths);

        if(this.paths.length > 0){
            this.undoBtn.disabled = false;
        }
        if(this.paths.length == 0){
            this.undoBtn.disabled = true;
        }

        this.triggerUpdate();
    }

    triggerUpdate(){
        if (this.onUpdate) {
            this.onUpdate(this.paths);
        }
    }

    //Get mouse location
    #getMouseLocation(event){
        const rect = this.canvas.getBoundingClientRect();
        return [
            Math.round(event.clientX - rect.left),
            Math.round(event.clientY - rect.top)
        ];
    }
}