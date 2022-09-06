import Utils from "../Utils.mjs";

class adaptiveThreshold {
  constructor() {
        // Default parameters
        this.index = Utils.RunningIndex();
        this.func = adaptiveThreshold;
        this.func_name = `adaptiveThreshold_${this.index}`;
        this.name = "Adaptive Threshold";
        this.description = "Applies an adaptive threshold to an image.";
        this.breakpoint = false;
        this.disabled = false;
        this.parameters = {
            "Output Threshold": {
                "index": 0,
                "type": "boundnumber",
                "selected": 255,
                "options": [0, 255]
            },
            "Adapative Method": {
                "index": 1,
                "type": "array",
                "selected": 'ADAPTIVE_THRESH_GAUSSIAN_C',
                "options": {
                    "ADAPTIVE_THRESH_GAUSSIAN_C": cv.ADAPTIVE_THRESH_GAUSSIAN_C,
                    "ADAPTIVE_THRESH_MEAN_C": cv.ADAPTIVE_THRESH_MEAN_C
                }
            },
            "Threshold Type": {
                "index": 2,
                "type": "array",
                "selected": 'THRESH_BINARY',
                "options": {
                    "THRESH_BINARY": cv.THRESH_BINARY ,
                    "THRESH_BINARY_INV": cv.THRESH_BINARY_INV 
                }
            },
            "Block Size": {
                "index": 3,
                "type": "oddnumber",
                "selected": 11,
            },
            "Constant": {
                "index": 4,
                "type": "evennumber",
                "selected": 2,
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
        const [maxv, method, type, block, constant] = this.getArgs()
        let fin = cv.adaptiveThreshold(input, input, maxv, method, type, block, constant);
        if (fin == undefined) {
            return input
        }
        return fin
    }
}

export default adaptiveThreshold;

/*
//FileName: index.mjs
//Code:
// Import every single operation file
import cvtColor from "./cvtColor.mjs";
import function_name from "./function_name.mjs";

export {cvtColor, function_name };
*/