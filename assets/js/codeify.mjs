// Converts a recipe into a string of code either javascript or python
// example of recipe:
/*
var inputRecipeJson = {
	"!__COMMENT__": "This is a JSON file generated by ImageChef. You can use the \"load\" button to load this recipe into ImageChef and start off from where you left off.",
	"!__AUTHOR__": "RagingGam0r",
	"resize_13": {
		"name": "resize",
		"breakpoint": false,
		"disabled": false,
		"parameters": {
			"Size": {
				"selected": [
					"100",
					"100"
				],
				"index": 0
			},
			"Scale must be set to (0,0) for fx/fy to be used": {
				"index": 1
			},
			"fx": {
				"selected": "0",
				"index": 2
			},
			"fy": {
				"selected": "0",
				"index": 3
			},
			"Interpolation": {
				"selected": "INTER_LINEAR",
				"index": 4
			}
		}
	},
	"cvtColor_14": {
		"name": "cvtColor",
		"breakpoint": false,
		"disabled": false,
		"parameters": {
			"Colour Space": {
				"selected": "BGR2XYZ",
				"index": 0
			}
		}
	},
	"cvtColor_15": {
		"name": "cvtColor",
		"breakpoint": false,
		"disabled": false,
		"parameters": {
			"Colour Space": {
				"selected": "RGB2HSV",
				"index": 0
			}
		}
	},
	"inRange_16": {
		"name": "inRange",
		"breakpoint": false,
		"disabled": false,
		"parameters": {
			"Lower Bound": {
				"selected": [
					"91",
					"47",
					"169"
				],
				"index": 0
			},
			"Upper Bound": {
				"selected": [
					"111",
					"255",
					"249"
				],
				"index": 1
			}
		}
	},
	"bitwise_and_17": {
		"name": "bitwise_and",
		"breakpoint": false,
		"disabled": false,
		"parameters": {
			"Source1": {
				"selected": "cvtColor_15",
				"index": 0
			},
			"Source2": {
				"selected": "cvtColor_15",
				"index": 1
			},
			"Mask": {
				"selected": "None",
				"index": 1
			}
		}
	},
	"inRange_18": {
		"name": "inRange",
		"breakpoint": false,
		"disabled": false,
		"parameters": {
			"Lower Bound": {
				"selected": [
					"28",
					"75",
					"110"
				],
				"index": 0
			},
			"Upper Bound": {
				"selected": [
					"48",
					"255",
					"255"
				],
				"index": 1
			}
		}
	},
	"bitwise_and_19": {
		"name": "bitwise_and",
		"breakpoint": true,
		"disabled": false,
		"parameters": {
			"Source1": {
				"selected": "resize_13",
				"index": 0
			},
			"Source2": {
				"selected": "resize_13",
				"index": 1
			},
			"Mask": {
				"selected": "inRange_16",
				"index": 1
			}
		}
	},
	"bitwise_and_20": {
		"name": "bitwise_and",
		"breakpoint": false,
		"disabled": false,
		"parameters": {
			"Source1": {
				"selected": "resize_13",
				"index": 0
			},
			"Source2": {
				"selected": "resize_13",
				"index": 1
			},
			"Mask": {
				"selected": "inRange_18",
				"index": 1
			}
		}
	}
}
*/
// example of code it generates: (python)
/*
print("Python code generated by ImageChef (https://github.com/RagingGam0r/ImageChef-testing)")
print("ImageChef was created by @RagingGam0r on GitHub (https://github.com/RagingGam0r)")
print("ImageChef is a free and open source project, please consider using it to make your own image processing projects!")
import cv2
import numpy as np
INPUTimg = cv2.imread("INPUTimg.png")

resize_0 = cv2.resize(INPUTimg, (100, 100), 0, 0, cv2.INTER_LINEAR)
cvtColor_1 = cv2.cvtColor(resize_0, cv2.COLOR_BGR2XYZ)
cvtColor_2 = cv2.cvtColor(cvtColor_1, cv2.COLOR_RGB2HSV)
inRange_3 = cv2.inRange(cvtColor_2, (91, 47, 169), (111, 255, 249))
bitwise_and_4 = cv2.bitwise_and(cvtColor_2, cvtColor_2, None)
inRange_5 = cv2.inRange(bitwise_and_4, (28, 75, 110), (48, 255, 255))
bitwise_and_6 = cv2.bitwise_and(resize_0, resize_0, inRange_3)
bitwise_and_7 = cv2.bitwise_and(resize_0, resize_0, inRange_5)

print("Thank you for using ImageChef (https://github.com/RagingGam0r/ImageChef-testing))|(https://github.com/RagingGam0r)!")

# Display images and break points
cv2.imshow("bitwise_and_6", bitwise_and_6)
cv2.imshow("final", bitwise_and_7)
cv2.waitKey(0)
cv2.destroyAllWindows()
*/

// Language will depend on the user's choice currently only plan to implement python and javascript
import * as edge from "./edgecases.mjs";

class Ingredient {
  constructor(key, name, parameters, breakpoint, disabled) {
    this.key = key;
    this.name = name;
    this.parameters = parameters;
    this.breakpoint = breakpoint;
    this.disabled = disabled;
  }
}

class Parameter {
    constructor(selected, index) {
        this.selected = selected; // can be a string or an array
        this.index = index;
    }
}

class Recipe {
    constructor() {
        this.ingredients = [];
    }

    addIngredient(ingredient) {
        this.ingredients.push(ingredient);
    }

    removeIngredient(ingredient) {
        this.ingredients = this.ingredients.filter(n => n !== ingredient);
    }
}

class CodeGenerator {
    constructor() {
        this.recipe = new Recipe();
    }

    generateRecipe(json) {
        for (let key in json) {
            // make sure key does not start with "!__"
            if (key.startsWith("!__")) {
                continue;
            }
            let ingredient = json[key];
            let parameters = {};
            let variableIndex = 0;
            for (let parameter in ingredient.parameters) {
                let selected = ingredient.parameters[parameter].selected;
                // if selected does not exist, skip parameter, and decrement index
                if (!selected) {
                    variableIndex--;
                    continue;
                }
                let index = ingredient.parameters[parameter].index - variableIndex;
                parameters[parameter] = new Parameter(selected, index);
            }
            this.recipe.addIngredient(new Ingredient(key, ingredient.name, parameters, ingredient.breakpoint, ingredient.disabled));
        }
        return this.recipe;
    }

    generateStartCode(language) {
        let code = "";
        let variablePrefix = "";
        let cvPrefix = "";
        let printmsgs = [
            // Welcome / Start
            `${language[0].toUpperCase() + language.slice(1)} code generated by ImageChef (https://github.com/RagingGam0r/ImageChef-testing)`, // ${language[0].toUpperCase() + language.slice(1)} == Capitalize first letter of language "python" -> "Python"
            "ImageChef was created by @RagingGam0r on GitHub (https://github.com/RagingGam0r)",
            "ImageChef is a free and open source project, please consider using it to make your own image processing projects!",
        ]
        if (language == "python") {
            code += "# Python code generated by ImageChef (https://github.com/RagingGam0r/ImageChef-testing)\n";
            for (let msg of printmsgs) {
                code += `print("${msg}")\n`;
            }
            code += "import cv2\n";
            //code += "import numpy as np\n";
            code += "INPUTimg = cv2.imread(\"INPUTimg.png\")\n";
            code += "\n";

            variablePrefix = "";
            cvPrefix = "cv2.";
        } else if (language == "javascript") {
            code += "// NOTE: Javascript is partially supported\n";
            code += "// But some features are not and **will** require you to manually add them.\n";
            code += "// Such as cv.Mat / cv.Scalar\n";
            code += "// Or replace certain features e.g replace (0, 0, 0) with [0, 0, 0]\n";
            code += "// This is because I am not familiar with javascript and I am not sure how to implement some features."
            code += "// Javascript code generated by ImageChef (https://github.com/RagingGam0r/ImageChef-testing)\n";
            for (let msg of printmsgs) {
                code += `console.log("${msg}");\n`;
            }
            code += "cv = require('./opencv.js');\n";
            code += "const INPUTimg = cv.imread('INPUTimg.png');\n";
            code += "\n";
            // custom fucntion to cv.imwrite instead of cv.imshow -- i am assuming they are using node.js or something, and idk how to imshow with node.js
            code += "cv.imshow = function (name, img) { // Overwrites cv.imshow to save image to disk, remove function to disable this.\n";
            code += "    cv.imwrite(`${name}.png`, img);\n";
            code += "}\n";
            code += "\n";

            variablePrefix = "let ";
            cvPrefix = "cv.";
        }
        return [code, variablePrefix, cvPrefix];
    }

    generateEndCode(language, variables, breakpoints) {
        let code = "";
        let variablePrefix = "";
        let cvPrefix = "";
        let printmsgs = [
            // End / Goodbye
            "Thank you for using ImageChef (https://github.com/RagingGam0r/ImageChef-testing)|(https://github.com/RagingGam0r)!"
        ]
        if (language == "python") {
            variablePrefix = "";
            cvPrefix = "cv2.";
            for (let msg of printmsgs) {
                if (msg == printmsgs[printmsgs.length - 1]) {
                    code += `print("${msg}")\n\n# Display images and break points\n`;
                } else {
                    code += `print("${msg}")\n`;
                }
            }
        } else if (language == "javascript") {
            variablePrefix = "let ";
            cvPrefix = "cv.";
            for (let msg of printmsgs) {
                if (msg == printmsgs[printmsgs.length - 1]) {
                    code += `console.log("${msg}");\n\n// Display images and break points\n`;
                } else {
                    code += `console.log("${msg}");\n`;
                }
            }
        }
        for (let variable of breakpoints) {
            // check if breakpoint is last in variables, if so skip
            if (variable == variables[variables.length - 1]) {
                continue;
            }
            code += `${cvPrefix}imshow("${variable}", ${variable})\n`;
        }
        code += `${cvPrefix}imshow("final", ${variables[variables.length - 1]})\n`;
        code += `${cvPrefix}waitKey(0)\n`;
        code += `${cvPrefix}destroyAllWindows()\n`;
        return [code];
    }

    generateCode(language="python") {
        let [code, variablePrefix, cvPrefix] = this.generateStartCode(language);
        let variables = [];
        let lookupEqiv = {};
        let variableIndex = 0;
        let breakpointDraws = [];

        // Part of code that actually generates code
        for (let ingredient of this.recipe.ingredients) {
            let variableName = ingredient.name + "_" + variableIndex;
            variables.push(variableName);
            lookupEqiv[ingredient.key] = variableName;
            let parameters = [];
            if (variableIndex == 0) {
                parameters.push("INPUTimg");
            } else if (!edge.noimg.includes(ingredient.name)) {
                // push previous ingredient's variable
                parameters.push(variables[variableIndex - 1]);
            }
            for (let parameter in ingredient.parameters) {
                let selected = ingredient.parameters[parameter].selected;
                // check if selected exists, if it does not, skip parameter, and decrement parameter index
                let index = ingredient.parameters[parameter].index;
                if (Array.isArray(selected)) {
                    parameters.push(`(${selected.join(", ")})`);
                } else if (typeof selected === "string") {
                    if (lookupEqiv[selected]) {
                        parameters.push(lookupEqiv[selected]);
                    } else if (edge.Cases[ingredient.name] && edge.Cases[ingredient.name][parameter] && edge.Cases[ingredient.name][parameter][selected]) {
                        parameters.push(`${cvPrefix}${edge.Cases[ingredient.name][parameter][selected]}`);
                    } else {
                        parameters.push(selected);
                    }
                }
            }
            code += `${variablePrefix}${variableName} = ${cvPrefix}${ingredient.name}(${parameters.join(", ")})\n`;
            variableIndex++;
            if (ingredient.breakpoint) {
                breakpointDraws.push(variableName);
            }
        }

        code += "\n";
        
        let [endCode] = this.generateEndCode(language, variables, breakpointDraws);
        code += endCode;

        return code;
        
    }
}

// export
export default CodeGenerator;