/* Wrapper for cv.inRange - Written by: RagingGam0r
    * @param {Mat} src input image: 8-bit single-channel or 3-channel image. -- Provided in run() call
    * @param {Mat} lowerb inclusive lower boundary array or a scalar. -- Customizable Scalar
    * @param {Mat} upperb inclusive upper boundary array or a scalar. -- Customizable Scalar
*/
import Utils from "../Utils.mjs";

class inRange {
  constructor() {
        // Default parameters
        this.index = Utils.RunningIndex();
        this.func = inRange;
        this.func_name = `inRange_${this.index}`;
        this.name = "In Range";
        this.description = "Checks if an images pixel colours lie between the two colour ranges provided.";
        this.breakpoint = false;
        this.disabled = false;
        this.parameters = {
            "Lower Bound": {
                "index": 0,
                "type": "boundscalarnumber",
                "selected": [127, 127, 127],
                "options": {
                    "1": [0, 255],
                    "2": [0, 255],
                    "3": [0, 255],
                }
            },
            "Upper Bound": {
                "index": 1,
                "type": "boundscalarnumber",
                "selected": [255, 255, 255],
                "options": {
                    "1": [0, 255],
                    "2": [0, 255],
                    "3": [0, 255]
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
        var [lowerb, upperb] = this.getArgs()
        lowerb.push(255)
        upperb.push(255)
        let lowerBound = new cv.Mat(input.rows, input.cols, input.type(), lowerb);
        let upperBound = new cv.Mat(input.rows, input.cols, input.type(), upperb);
        let fin = cv.inRange(input, lowerBound, upperBound, input);
        lowerBound.delete();
        upperBound.delete();
        if (fin == undefined) {
            return input
        }
        return fin
    }
}

export default inRange;