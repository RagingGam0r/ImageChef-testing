import Utils from "../Utils.mjs";

class blur {
  constructor() {
        // Default parameters
        this.index = Utils.RunningIndex();
        this.func = blur;
        this.func_name = `blur_${this.index}`;
        this.name = "Homogeneous Blur";
        this.description = "Blurs an image using the normalized box filter.";
        this.breakpoint = false;
        this.disabled = false;
        this.parameters = {
            "Kernel Size": { // Kernel size, for blur
                "index": 0,
                "type": "kernelnumber",
                "selected": [5, 5],
            },
            "Anchor Point": { // Anchor point of the kernel, for blur
                "index": 1,
                "type": "kernelnumber",
                "selected": [-1, -1], // Default: [-1, -1], anchor is at the kernel center
            },
            "Border Type": {
                "index": 2,
                "type": "array",
                "selected": 'BORDER_DEFAULT',
                "options": {
                    "BORDER_DEFAULT": cv.BORDER_DEFAULT, // cv.BORDER_REFLECT_101 == cv.BORDER_REFLECT101 == cv.BORDER_DEFAULT
                    "BORDER_CONSTANT": cv.BORDER_CONSTANT,
                    "BORDER_REPLICATE": cv.BORDER_REPLICATE,
                    "BORDER_REFLECT": cv.BORDER_REFLECT,
                    "BORDER_WRAP": cv.BORDER_WRAP, // In docs says not supported for cv.blur
                    "BORDER_TRANSPARENT": cv.BORDER_TRANSPARENT, // Seems to error, but in docs says supported
                    "BORDER_ISOLATED": cv.BORDER_ISOLATED,
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
        const [ksize_base, anchor_base, borderType] = this.getArgs()
        let ksize = new cv.Size(ksize_base[0], ksize_base[1])
        let anchor = new cv.Point(anchor_base[0], anchor_base[1])
        let fin = cv.blur(input, input, ksize, anchor, borderType);
        if (fin == undefined) {
            return input
        }
        return fin
    }
}

export default blur;