import Utils from "../Utils.mjs";

class bitwise_and {
  constructor() {
        // Default parameters
        this.index = Utils.RunningIndex();
        this.func = bitwise_and;
        this.func_name = `bitwise_and_${this.index}`;
        this.name = "Bitwise AND";
        this.description = "Performs a bitwise AND operation on an image. If a pixel on both image is black, the resulting pixel will be black. If a pixel on both image is white, the resulting pixel will be white. If pixel is white on one image and black on the other, the resulting pixel will be black. If pixel is black on one image and white on the other, the resulting pixel will be white. If pixel is white on one image and gray on the other, the resulting pixel would be a lighter gray.";
        this.breakpoint = false;
        this.disabled = false;
        this.parameters = {
            "Source1": { 
                "index": 0,
                "type": "array",
                "selected": 'Input',
                "options": { // These change on the fly depending on previous ingredients in recipe
                  "Input": "Input",
                  "Source": "Source",
                  "PLEASE BAKE TO UPDATE PARAMETERS": "PLEASE BAKE TO UPDATE PARAMETERS"
                }
            },
            "Source2": {
                "index": 1,
                "type": "array",
                "selected": 'Input',
                "options": {
                    "Input": "Input",
                    "Source": "Source",
                    "PLEASE BAKE TO UPDATE PARAMETERS": "PLEASE BAKE TO UPDATE PARAMETERS"
                }
            },
            "Mask": {
                "index": 1,
                "type": "array",
                "selected": 'None',
                "options": {
                    "None": "None",
                    "Input": "Input",
                    "Source": "Source",
                    "PLEASE BAKE TO UPDATE PARAMETERS": "PLEASE BAKE TO UPDATE PARAMETERS"
                }
            }
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
    run(input, steps) {
        var [target1, target2, mask1] = this.getArgs()

        console.log("Running bitwise_and")
        console.log(`target1: ${target1}`)
        console.log(`target2: ${target2}`)
        console.log(`mask1: ${mask1}`)

        let target1_image = steps[target1] || input
        let target2_image = steps[target2] || input
        let output = new cv.Mat.zeros(target1_image.rows, target1_image.cols, cv.CV_8UC1)

        // The source / target1 / target2 is a string, and equals to a key in the steps dictionary.
        if (mask1 == "None") {
            let fin = cv.bitwise_and(target1_image, target2_image, output)
            if (fin == undefined) {
                return output
            }
            return fin
        }
        let mask1_image = steps[mask1] || input

        let fin = cv.bitwise_and(target1_image, target2_image, output, mask1_image)
        if (fin == undefined) {
            return output
        }
        return fin
    }
}

export default bitwise_and;