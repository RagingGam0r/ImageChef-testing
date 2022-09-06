import Utils from "../Utils.mjs";

class findContours {
  constructor() {
        // Default parameters
        this.index = Utils.RunningIndex();
        this.func = findContours;
        this.func_name = `findContours_${this.index}`;
        this.name = "Find Contours";
        this.description = "Finds contours in an image";
        this.breakpoint = false;
        this.disabled = false;
        this.parameters = {
            "Retrieval Mode": { // Can specify an array of values user can choose from
                "index": 0,
                "type": "array",
                "selected": 'RETR_TREE', // Can be any of the options in the array
                "options": {
                    "RETR_EXTERNAL": cv.RETR_EXTERNAL,
                    "RETR_LIST": cv.RETR_LIST,
                    "RETR_CCOMP": cv.RETR_CCOMP,
                    "RETR_TREE": cv.RETR_TREE,
                    "RETR_FLOODFILL": cv.RETR_FLOODFILL,
                }
            },
            "Approximation Method": { // Can specify an array of values user can choose from
                "index": 1,
                "type": "array",
                "selected": 'CHAIN_APPROX_SIMPLE', // Can be any of the options in the array
                "options": {
                    "CHAIN_APPROX_NONE": cv.CHAIN_APPROX_NONE,
                    "CHAIN_APPROX_SIMPLE": cv.CHAIN_APPROX_SIMPLE,
                    "CHAIN_APPROX_TC89_L1": cv.CHAIN_APPROX_TC89_L1,
                    "CHAIN_APPROX_TC89_KCOS": cv.CHAIN_APPROX_TC89_KCOS,
                }
            },
            "Offset": { // Can specify an array of values user can choose from
                "index": 2,
                "type": "kernelnumber",
                "selected": [0, 0],
            },
            "Min / Max Area": { // Can specify an array of values user can choose from
                "index": 3,
                "type": "kernelnumber",
                "selected": [0, 0],
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
        const [mode, method, offset, area] = this.getArgs()
        let contours = new cv.MatVector();
        let hierarchy = new cv.Mat();
        let offsetPoint = new cv.Point(offset[0], offset[1]);
        let fin = cv.findContours(input, contours, hierarchy, mode, method, offsetPoint);
        let minArea = area[0] == 0 ? 0 : area[0];
        let maxArea = area[1] == 0 ? Number.MAX_SAFE_INTEGER : area[1];
        let newContours = new cv.MatVector();
        let newHierarchy = new cv.Mat();
        for (let i = 0; i < contours.size(); i++) {
            let contour = contours.get(i);
            let area = cv.contourArea(contour);
            if (area > minArea && area < maxArea) {
                newContours.push_back(contour);

            }
        }
        
        let output = cv.Mat.zeros(input.rows, input.cols, cv.CV_8UC3);
        let color = new cv.Scalar(255, 255, 255);
        cv.drawContours(output, newContours, -1, color, 1, cv.LINE_8);
        return output;
    
    }
}

export default findContours;