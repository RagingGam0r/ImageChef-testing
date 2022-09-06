// Import every single operation file
// CLR Space
import cvtColor from "./cvtColor.mjs";

// Thresholding / BlackWhite Masks
import threshold from "./threshold.mjs";
import adaptiveThreshold from "./adaptiveThreshold.mjs";
import inRange from "./inRange.mjs";

// Blurs
import blur from "./blur.mjs";
import GaussianBlur from "./GaussianBlur.mjs";
import medianBlur from "./medianBlur.mjs";
import bilateralFilter from "./bilateralFilter.mjs";

// Functions that dont draw - e.g findContours
import findContours from "./findContours.mjs";

// Functions that do draw / modify the image
import resize from "./resize.mjs";

// Unique Operations - Mainly bitwise operations e.g bitwise_not, bitwise_and, bitwise_or, bitwise_xor
import bitwise_not from "./bitwise_not.mjs";
import bitwise_and from "./bitwise_and.mjs";

// Testing function, has every type of parameter
import function_name from "./function_name.mjs";

// Categories
let exportlist = {
    "CLR Space": {
        "cvtColor": cvtColor
    },
    "Thresholding / Masks": {
        "threshold": threshold,
        "adaptiveThreshold": adaptiveThreshold,
        "inRange": inRange
    },
    "Blur": {
        "blur": blur,
        "GaussianBlur": GaussianBlur,
        "medianBlur": medianBlur,
        "bilateralFilter": bilateralFilter
    },
    "No Draw": {
        "findContours": findContours
    },
    "Do Draw": {
        "resize": resize
    },
    "Bitwise": {
        "bitwise_not": bitwise_not,
        "bitwise_and": bitwise_and
    },
    "Debug": {
        "function_name": function_name
    }
}

// export {cvtColor, threshold, adaptiveThreshold, inRange, blur, GaussianBlur, medianBlur, bilateralFilter, findContours, resize, bitwise_not, bitwise_and, function_name};
export {exportlist}