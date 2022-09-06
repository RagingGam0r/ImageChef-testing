// BASE FORMAT FOR OPERATIONS
//FileName: function_name.mjs
//Code:
import Utils from "../Utils.mjs";

class function_name {
  constructor() {
        // Default parameters
        this.index = Utils.RunningIndex();
        this.func = function_name;
        this.func_name = `function_name_${this.index}`;
        this.name = "Function Name";
        this.description = "Function Description";
        this.breakpoint = false;
        this.disabled = false;
        this.parameters = {
            "Comment" : {
                "index": 0,
                "type": "comment",
            },
            "Parameter1_Aaray": { // Can specify an array of values user can choose from
                "index": 1,
                "type": "array",
                "selected": 'variable2', // Can be any of the options in the array
                "options": {
                    "variable1": cv.variable1,
                    "variable2": cv.variable2,
                    "variable3": cv.variable3,
                }
            },
            "Parameter2_Bool_false": { // Can create a checkbox / boolean parameter -- Default: Selected = false
                "index": 2,
                "type": "boolean",
                "selected": false,
            },
            "Parameter3_Bool_true": { // Can create a checkbox / boolean parameter -- Default: Selected = true
                "index": 3,
                "type": "boolean",
                "selected": true,
            },
            "Parameter4_Number": { // Create a number parameter
                "index": 4,
                "type": "number",
                "selected": 0,
            },
            "Parameter5_BoundNumber": { // Create a bounded number parameter, if less than options[0], set to options[0] or greater than options[1], set to options[1]
                "index": 5,
                "type": "boundnumber",
                "selected": 255,
                "options": [0, 255]
            },
            "Parameter6_OddNumber": { // Create a odd number parameter, only odd numbers allowed
                "index": 6,
                "type": "oddnumber",
                "selected": 11,
            },
            "Parameter7_EvenNumber": { // Create a even number parameter, only even numbers allowed
                "index": 7,
                "type": "evennumber",
                "selected": 2,
            },
            "Parameter8_KernelNumber": { // Variants o above, but kernel, number
                "index": 8,
                "type": "kernelnumber",
                "selected": [3, 3],
            },
            "Parameter9_BoundKernelNumber": { // Variants of above, but kernel, bound
                "index": 9,
                "type": "boundkernelnumber",
                "selected": [3, 3],
                "options": [
                    [1, 10],
                    [1, 10]
                ],
            },
            "Parameter10_OddKernelNumber": { // Variants of above, but kernel, odd
                "index": 10,
                "type": "oddkernelnumber",
                "selected": [3, 3],
            },
            "Parameter11_EvenKernelNumber": { // Variants of above, but kernel, even
                "index": 11,
                "type": "evenkernelnumber",
                "selected": [2, 2],
            },
            "Parameter12_ScalarNumber": { // Scalar number, can be any number (Used for colours e.g RGB)
                "index": 12,
                "type": "scalarnumber",
                "selected": [255, 255, 255],
                "options": [
                    "R",
                    "G",
                    "B"
                ]
            },
            "Parameter12_CleanScalarNumber": { // Scalar number, can be any number (Used for colours e.g RGB)
                "index": 13,
                "type": "scalarnumber",
                "selected": [255, 255, 255],
                "options": [
                    "1",
                    "2",
                    "3"
                ]
            },
            "Parameter14_BoundScalarNumber": { // Variants of above, but scalar, bound (limit a clr to 0-255)
                "index": 14,
                "type": "boundscalarnumber",
                "selected": [255, 255, 255],
                "options": {
                    "R": [0, 255],
                    "G": [0, 255],
                    "B": [0, 255]
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
        const [arg1, arg2] = this.getArgs()
        let fin = cv.function_name(input, input, arg1, arg2);
        if (fin == undefined) {
            return input
        }
        return fin
    }
}

export default function_name;

/*
//FileName: index.mjs
//Code:
// Import every single operation file
import cvtColor from "./cvtColor.mjs";
import function_name from "./function_name.mjs";

export {cvtColor, function_name };
*/