import Utils from "../Utils.mjs";

class bilateralFilter {
  constructor() {
        // Default parameters
        this.index = Utils.RunningIndex();
        this.func = bilateralFilter;
        this.func_name = `bilateralFilter_${this.index}`;
        this.name = "Bilateral Filter";
        this.description = "Applies a bilateral filter to an image. Bilateral Filter can reduce unwanted noise very well while keeping edges fairly sharp. However, it is very slow.";
        this.breakpoint = false;
        this.disabled = false;
        this.parameters = {
            "d": {
                "index": 0,
                "type": "number",
                "selected": 15,
            },
            "sigmaColor": {
                "index": 1,
                "type": "number",
                "selected": 80,
            },
            "sigmaSpace": {
                "index": 2,
                "type": "number",
                "selected": 80,
            },
            "Border Type": {
                "index": 4,
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
        Utils.log(`ERROR: bilateralFilter has not been successfully implemented yet, no matter how i test it bilateralFilter does not appear to work for opencv.js`, `error`);
        Utils.log(`WARNING: ${this.name} is a very slow algorithm. It is recommended to use it on a small image.`, "warning")
        const [d, sigmaColor, sigmaSpace, borderType] = this.getArgs()
        let imgElement = document.getElementsByClassName("imageSrc")[0];
        let dst = new cv.Mat();
        cv.bilateralFilter(cv.imread(imgElement), dst, d, sigmaColor, sigmaSpace, borderType);
        console.log(dst)
        if (dst == undefined) {
            return input
        }
        return dst
    }
}

export default bilateralFilter;