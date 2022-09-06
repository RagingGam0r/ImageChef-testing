import Utils from "../Utils.mjs";

class medianBlur {
  constructor() {
        // Default parameters
        this.index = Utils.RunningIndex();
        this.func = medianBlur;
        this.func_name = `medianBlur_${this.index}`;
        this.name = "Median Blur";
        this.description = "Blurs an image using Median Filtering. Replaces each pixel with the median of its neighboring pixels.";
        this.breakpoint = false;
        this.disabled = false;
        this.parameters = {
            "Kernel": {
                "index": 0,
                "type": "oddnumber",
                "selected": 3,
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
        const [kernel] = this.getArgs()
        let fin = cv.medianBlur(input, input, kernel)
        if (fin == undefined) {
            return input
        }
        return fin
    }
}

export default medianBlur;