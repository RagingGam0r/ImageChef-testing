import Utils from "../Utils.mjs";

class GaussianBlur {
  constructor() {
        // Default parameters
        this.index = Utils.RunningIndex();
        this.func = GaussianBlur;
        this.func_name = `GaussianBlur_${this.index}`;
        this.name = "Gaussian Blur";
        this.description = "Blurs an image using Gaussian filtering. Gaussian filtering is done by convolving each point in the image with a Gaussian kernel and then summing them all to produce the output image.";
        this.breakpoint = false;
        this.disabled = false;
        this.parameters = {
            "Kernel Size": {
                "index": 0,
                "type": "oddkernelnumber",
                "selected": [3, 3],
            },
            "Sigma": { 
                "index": 1,
                "type": "kernelnumber",
                "selected": [0, 0],
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
                    "BORDER_WRAP": cv.BORDER_WRAP,
                    "BORDER_TRANSPARENT": cv.BORDER_TRANSPARENT,
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
        const [kernel, sigma, borderType] = this.getArgs()
        console.log(this.parameters["Border Type"]["options"]["BORDER_DEFAULT"])
        let kernelSize = new cv.Size(kernel[0], kernel[1])
        console.log(kernelSize);
        let sigmaX = sigma[0]
        let sigmaY = sigma[1]
        let fin = cv.GaussianBlur(input, input, kernelSize, sigmaX, sigmaY, borderType);
        if (fin == undefined) {
            return input
        }
        return fin
    }
}

export default GaussianBlur;