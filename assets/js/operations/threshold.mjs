import Utils from "../Utils.mjs";

class threshold {
  constructor() {
        // Default parameters
        this.index = Utils.RunningIndex();
        this.func = threshold;
        this.func_name = `threshold_${this.index}`;
        this.name = "Threshold";
        this.description = "Simple global thresholding.";
        this.breakpoint = false;
        this.disabled = false;
        this.parameters = {
            "Minimum Threshold": { // Create a bounded number parameter, if less than options[0], set to options[0] or greater than options[1], set to options[1]
                "index": 0,
                "type": "boundnumber",
                "selected": 127,
                "options": [0, 255]
            },
            "Maximum Threshold": { // Create a bounded number parameter, if less than options[0], set to options[0] or greater than options[1], set to options[1]
                "index": 1,
                "type": "boundnumber",
                "selected": 255,
                "options": [0, 255]
            },
            "Threshold Type": { // Can specify an array of values user can choose from
                "index": 2,
                "type": "array",
                "selected": 'THRESH_BINARY',
                "options": {
                    "THRESH_BINARY": cv.THRESH_BINARY ,
                    "THRESH_BINARY_INV": cv.THRESH_BINARY_INV,
                    "THRESH_TRUNC": cv.THRESH_TRUNC,
                    "THRESH_TOZERO": cv.THRESH_TOZERO,
                    "THRESH_TOZERO_INV": cv.THRESH_TOZERO_INV
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
        const [minv, maxv, type] = this.getArgs()
        let fin = cv.threshold(input, input, minv, maxv, type);
        if (fin == undefined || fin == null || fin != cv.mat) {
            return input
        }
        return fin
    }
}

export default threshold;