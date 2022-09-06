import Utils from "../Utils.mjs";

class resize {
  constructor() {
        // Default parameters
        this.index = Utils.RunningIndex();
        this.func = resize;
        this.func_name = `resize_${this.index}`;
        this.name = "Resize";
        this.description = "Resize an image to a given size.";
        this.breakpoint = false;
        this.disabled = false;
        this.parameters = {
            "Size": { // Size to resize to
                "index": 0,
                "type": "kernelnumber",
                "selected": [100, 100],
            },
            "Scale must be set to (0,0) for fx/fy to be used": { // Scale must be set to (0,0) for fx/fy to be used -- comment
                "index": 1,
                "type": "comment",
            },
            "fx": { // Scale factor along the horizontal axis when it equals 0 it is computed as: size.width/source.cols
                "index": 2,
                "type": "number",
                "selected": 0,
            },
            "fy": { // Scale factor along the vertical axis when it equals 0 it is computed as: size.height/source.rows
                "index": 3,
                "type": "number",
                "selected": 0,
            },
            "Interpolation": { // Interpolation method
                "index": 4,
                "type": "array",
                "selected": 'INTER_LINEAR', 
                "options": {
                    "INTER_NEAREST": cv.INTER_NEAREST,
                    "INTER_LINEAR": cv.INTER_LINEAR,
                    "INTER_CUBIC": cv.INTER_CUBIC,
                    "INTER_AREA": cv.INTER_AREA,
                    "INTER_LANCZOS4": cv.INTER_LANCZOS4,
                    "INTER_LINEAR_EXACT": cv.INTER_LINEAR_EXACT,
                    "INTER_NEAREST_EXACT": cv.INTER_NEAREST_EXACT,
                    //"INTER_MAX": cv.INTER_MAX, // Errors
                    //"WARP_FILL_OUTLIERS": cv.WARP_FILL_OUTLIERS,
                    //"WARP_INVERSE_MAP": cv.WARP_INVERSE_MAP,
                }
            },
        }
    }

    getArgs() {
        let args = []
        for (let param of Object.keys(this.parameters)) {
            if (this.parameters[param].type == "array") {
                let selected = this.parameters[param].selected
                let value = this.parameters[param].options[selected]
                args.push(value)
            } else if (this.parameters[param].type == "boolean") {
                let selected = this.parameters[param].selected
                args.push(selected)
            } else if (this.parameters[param].type == "oddnumber" || this.parameters[param].type == "evennumber" || this.parameters[param].type == "boundnumber" || this.parameters[param].type == "number") {
                args.push(parseInt(this.parameters[param].selected))
            } else if (this.parameters[param].type == "kernelnumber" || this.parameters[param].type == "boundkernelnumber" || this.parameters[param].type == "oddkernelnumber" || this.parameters[param].type == "evenkernelnumber") {
                let selected = this.parameters[param].selected
                let value = [parseInt(selected[0]), parseInt(selected[1])]
                args.push(value)
            } else if (this.parameters[param].type == "scalarnumber" || this.parameters[param].type == "boundscalarnumber") {
                let selected = this.parameters[param].selected
                let value = [parseInt(selected[0]), parseInt(selected[1]), parseInt(selected[2])]
                args.push(value)
            }
        }
        return args
    }
    
    /*
    Input == The image to run the algorithm on
    */
    run(input) {
        const [size, fx, fy, Interpolation] = this.getArgs()
        let resizeSize = new cv.Size(size[0], size[1])
        let fin = cv.resize(input, input, resizeSize, fx, fy, Interpolation)
        if (fin == undefined) {
            return input
        }
        return fin
    }
}

export default resize;