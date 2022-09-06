/*
Index.js - Main
Written by RagingGam0r

This code is very messy and needs to be cleaned up, i wrote this entire website over a week when i had barely touched HTML/CSS, and knew basic Javascript.
As such this code is an abomination and could definitely be split across several files, however i can't be bothered to do that right now.
Maybe if i get back to this project in the future, i'll clean it up.
*/
import * as wrapper from "./operations/index.mjs";
import {fuzzyMatch, calcMatchRanges} from './FuzzyMatch.mjs';
import Utils from "./Utils.mjs";
import CodeGenerator from "./codeify.mjs";
import * as allLanguage from "../preload/code/allLanguage.mjs";

var autobake = false;
var steps = [];
var Categories = {};
var ExpandedCategories = {};
var Operations = {};
var Recipes = [];
// TBH, idk if i need to clean up event listeners as i rarely use javascript, however it seems like a good idea to do it
var opbtnEventListeners = []; // Array of event listeners for operation buttons, destroy them when options reloaded, prevent memory leak
var recbtnEventListeners = []; // Array of event listeners for recipe buttons, destroy them when recipe reloaded, prevent memory leak
var changeEventListeners = []; // Array of event listeners for recipe buttons, destroy them when recipe reloaded, prevent memory leak

(async() => {
    let waitFor = [
        "cv",
        "THRESH_BINARY",
        "BORDER_DEFAULT",
    ]

    Utils.log("waiting for variable -- main -- cv", "info");
    for (let wait of waitFor) {
        let truewait = ""
        if (wait == "cv") {
            while(!window.hasOwnProperty(wait))
                await new Promise(resolve => setTimeout(resolve, 1));
        } else {
            while(!window.cv.hasOwnProperty(wait))
            await new Promise(resolve => setTimeout(resolve, 1));
        }
    }
    Utils.log("variable is defined -- main -- cv", "success");

    // Loop over assetts/js/opperations, and add them to the Operations array
    // for (let wrap of Object.values(wrapper)) {
    //     console.log(wrap);
    //     Operations[wrap.name] = new wrap(); // LOOK INTO GETTING MORE MEMORY EFFICENT
    // }
    for (let categorykey of Object.keys(wrapper.exportlist)) {
        let category = wrapper.exportlist[categorykey];
        Categories[categorykey] = {

        };
        for (let operationkey of Object.keys(category)) {
            let operation = category[operationkey];
            let created = new operation();
            Operations[operation.name] = created;
            Categories[categorykey][operation.name] = created;
            ExpandedCategories[categorykey] = false
        }
    }

    main();
    Utils.log(`Notice to anyone who is using this website, sometimes opencv.js will throw a random error of pure numbers, sometimes this is the users fault but most of the time something has broken internally, if you get this error save your recipe and reload the page.`, "warning");
})();


function clickDetection(id, clas) {
    if (clas == "mix") {
        // Check if operation exists in Operations array
        // Get method name, text before last _
        let split = id.split("_")
        let method = ""
        for (let i = 0; i < split.length - 1; i++) {
            method += split[i] + "_"
        }
        method = method.substring(0, method.length - 1)

        if (!Operations.hasOwnProperty(method)) {
            Utils.log("Operation " + method + " does not exist", "error");
            return;
        }
        // Create new operation
        let operation = new Operations[method].func();
        // Add operation to Recipe
        Recipes.push(operation);
        Utils.log(`Mixing ${operation.name} : ${operation.func_name} : ${method}`, "success");
        updateSelected();
    }
}

function setupImage(e) {
    Utils.log("Image loading", "info");
    let imgElement = document.getElementsByClassName("imageSrc")[0];
    let URLobj = URL.createObjectURL(e.target.files[0]);
    document.getElementById("INPUThiddenImageSourceSuperSecret").src = URLobj // using this to prevent image from resizing when performing operations
    imgElement.src = URLobj
    document.getElementById("INPUThiddenImageSourceSuperSecret").onload = function() {
        if (document.getElementById("canvasOutput") == null) {
            let canvasOutput = document.createElement("canvas");
            canvasOutput.setAttribute("class", "canvasOutput");
            canvasOutput.setAttribute("id", "canvasOutput");
            document.getElementById("output-image").appendChild(canvasOutput);
        }
        document.getElementById("canvasOutput").style = "border: none;"
        let read = safeImRead(imgElement)
        let trueimg = safeImRead(document.getElementById("INPUThiddenImageSourceSuperSecret"));
        if (read == null || trueimg == null) {
            Utils.log("Failed to setup image", "error");
            return;
        }
        Utils.log(`True Image Details: ${trueimg.cols}x${trueimg.rows}x${trueimg.channels()} | Type: ${trueimg.type()} | Depth: ${trueimg.depth()}`, `info`);
        Utils.log(`Display Image Details: ${read.cols}x${read.rows}x${read.channels()} | Type: ${read.type()} | Depth: ${read.depth()}`, `info`);
        if (autobake) {
            bakeRecipe();
        }
    }
}

// Creates a new HTML element for each operation, parent == operation-list
function setupOperations() {
    /*
    <div class="operation">
        <div class="operation-title">
            <h1>GrayScale</h1>
        </div>
        <div class="operation-description">
            <p>Convert an image to GrayScale.</p>
        </div>
        <div class="operation-button">
            <input type="submit" value="Mix" class="mix" id="cvtColor-mix"></input>
        </div>
    </div>
    */
    // let operationList = document.getElementById("operation-list");
    let operationList = searchOperations(document.getElementById("operation-search-input"));
    /*
    operationList = {
        "cvtColor": "Convert Colour Space",
        ...
    }
    */

    let html = ``;
    if (!(Object.keys(operationList).length == Object.keys(Operations).length)) {
        for (let i = 0; i < Object.keys(operationList).length; i++) {
            let operationName = Object.keys(operationList)[i];
            let operation = operationList[operationName]["operation"];
            html += Utils.toOperationHtmlOLD(operation)
        }
        html += `<div class="operation" style="visibility: hidden;">
            <div class="operation-title">
                <h1>-</h1>
            </div>
        </div>`;
    } 
    for (let categorykey of Object.keys(Categories)) {
        let category = Categories[categorykey];
        let expanded = ExpandedCategories[categorykey];
        html += Utils.toOperationHtml(categorykey, expanded, Object.values(category))
    }
    /*
    <div class="operation-search">
        <input type="text" id="operation-search-input" placeholder="Search...">
    </div>
    */
    //html += `<div class="operation-search">`
    //html += `<input type="text" id="operation-search-input" placeholder="Search...">`
    //html += `</div>`

    //for (let i = 0; i < Object.keys(operationList).length; i++) {
    //    let operationName = Object.keys(operationList)[i];
    //    let operation = operationList[operationName]["operation"];
    //    html += Utils.toOperationHtml(operation)
    //}
    

    // check if opbtnEventListeners is empty, if not, remove all event listeners
    if (opbtnEventListeners.length > 0) {
        while (opbtnEventListeners.length > 0) {
            let poped = opbtnEventListeners.pop();
            poped.outerHTML = poped.outerHTML; // remove event listener
        }
    }

    document.getElementById("operation-list").innerHTML = html;

    // add event listeners to category buttons
    for (let categorykey of Object.keys(Categories)) {
        let btn = document.getElementById(`${categorykey}-button`);
        btn.addEventListener("click", function() {
            let expanded = ExpandedCategories[categorykey];
            ExpandedCategories[categorykey] = !expanded;
            setupOperations();
        });
        opbtnEventListeners.push(btn);
    }

    // Setup Mix button -- Loop over className with "mix"
    let mix = document.getElementsByClassName("mix");
    let id = "";
    for (let btn of mix) {
        id = btn.id;
        btn.addEventListener("click", function(){
            clickDetection(this.id, this.className);
        });
        opbtnEventListeners.push(btn);
    }
}

function searchOperations(e) {
    if (e.target && e.target.value) {
        var str = e.target.value;
    } else {
        var str = e.value;
    }

    let operationNameList = {}// get all operation names as strings that are equal to their description
    for (let operation of Object.values(Operations)) {
        operationNameList[operation.name] = {
            "desc": operation.description,
            "operation": operation,
        };
    }

    if (str == "" || str==undefined) {
        return operationNameList;
    }
    
    let matched = filterOperations(operationNameList, str);

    let final = {}
    for (let i = 0; i < matched.length; i++) {
        final[matched[i]] = operationNameList[matched[i]];
    }

    return final;
}

function filterOperations(operationList, str) {
    let matchedOps = [];
    let matchedDescs = [];

    let search = str.replace(/\s/g, ""); // Remove whitespace, Helps avoid missing matches e.g "Space " would not find "Convert Colour Space"

    // Loop over all operations
    for (let i = 0; i < Object.keys(operationList).length; i++) {
        let operationName = Object.keys(operationList)[i];
        let operationDesc = operationList[operationName]["desc"];
        
        // Match the op name using fuzzy match
        let [nameMatch, score, idxs] = fuzzyMatch(search, operationName);

        // Match description based on exact match
        let descPos = operationDesc.toLowerCase().indexOf(search.toLowerCase());

        if (nameMatch || descPos >= 0) {
            if (nameMatch) {
                matchedOps.push(operationName);
            } else {
                matchedDescs.push(operationName);
            }
        }
    }

    let oldmatchedOps = matchedOps.slice();

    // Sort matched operations based on fuzzy score
    matchedOps.sort((a, b) => b[1] - a[1]);

    matchedOps = matchedOps.map(a => a[0]).concat(matchedDescs);

    if (matchedOps.length == 0) {
        return []
    }

    // check if first element is one char long
    if (matchedOps[0].length == 1) {
        // Idk why but my code breaks when this happens, just return old matchedOps
        return oldmatchedOps;
    }

    return matchedOps
}

function refreshRecipe(depth=0) {
    Utils.overflowConsoleCheck(document.getElementById("console-log"));

    /*
    <div class="recipe">
        <div class="recipe-title">
            <h1>GrayScale</h1>
        </div>
        <div class="recipe-parameters">
            <select class="recipe-dropdown" arg-name="Colour Space">
                <option>GrayScaleV0</option>
                <option>GrayScaleV1</option>
                <option>GrayScaleV2</option>
                <option>GrayScaleV3</option>
                <option>GrayScaleV4</option>
                <option>GrayScaleV5</option>
            </select>
        </div>
    </div>
    */
    let recipeList = document.getElementById("recipe-list");

    let html = "";
    let i = 0;

    for (let recipe of Recipes) {
        // Get HTML for recipe
        html += Utils.toRecipeHtml(recipe, i, Recipes.length-1);
        i++;
    }

    // check if recbtnEventListeners is empty, if not, remove all event listeners
    if (recbtnEventListeners.length > 0) {
        while (recbtnEventListeners.length > 0) {
            let poped = recbtnEventListeners.pop();
            poped.outerHTML = poped.outerHTML; // remove event listener
        }
    }

    // check if changeEventListeners is empty, if not, remove all event listeners
    if (changeEventListeners.length > 0) {
        while (changeEventListeners.length > 0) {
            let poped = changeEventListeners.pop();
            poped.outerHTML = poped.outerHTML; // remove event listener
        }
    }

    recipeList.innerHTML = html;

    // Bind ${operation.func_name}-remove to remove operation from Recipe
    for (let recipe of recipeList.childNodes) {
        // check if element is div with class "recipe"
        if (recipe.nodeName != "DIV" || recipe.className.split(" ")[0] != "recipe") {
            continue;
        }
        let remove = document.getElementById(`${recipe.getAttribute("id")}-remove`)
        remove.addEventListener("click", function(e) {
            let index = 0
            for (let recp of Recipes) {
                if (recp.func_name == recipe.getElementsByClassName("recipe-title")[0].childNodes[3].innerHTML) {
                    break;
                }
                index++;
            }
            Recipes.splice(index, 1);
            Utils.log(`Removed ${recipe.getElementsByClassName("recipe-title")[0].childNodes[1].innerHTML} : ${recipe.getElementsByClassName("recipe-title")[0].childNodes[3].innerHTML}`, "success");
            refreshRecipe();
        } );
        recbtnEventListeners.push(remove);
    }

    // Bind ${operation.func_name}-disable to disable operation from Recipe
    for (let recipe of recipeList.childNodes) {
        // check if element is div with class "recipe"
        if (recipe.nodeName != "DIV" || recipe.className.split(" ")[0] != "recipe") {
            continue;
        }
        let disableorenable = document.getElementById(`${recipe.getAttribute("id")}-disable`) || document.getElementById(`${recipe.getAttribute("id")}-enable`);
        disableorenable.addEventListener("click", function(e) {
            let index = 0
            for (let recp of Recipes) {
                if (recp.func_name == recipe.getElementsByClassName("recipe-title")[0].childNodes[3].innerHTML) {
                    break;
                }
                index++;
            }
            Recipes[index].disabled = !Recipes[index].disabled;
            Utils.log(`Disabled ${recipe.getElementsByClassName("recipe-title")[0].childNodes[1].innerHTML} : ${recipe.getElementsByClassName("recipe-title")[0].childNodes[3].innerHTML}`, "success");
            refreshRecipe();
        } );
        recbtnEventListeners.push(disableorenable);
    }

    // Bind ${operation.func_name}-breakpoint to breakpoint operation from Recipe
    for (let recipe of recipeList.childNodes) {
        // check if element is div with class "recipe"
        if (recipe.nodeName != "DIV" || recipe.className.split(" ")[0] != "recipe") {
            continue;
        }
        let breakpoint = document.getElementById(`${recipe.getAttribute("id")}-breakpoint`)
        breakpoint.addEventListener("click", function(e) {
            let index = 0
            for (let recp of Recipes) {
                if (recp.func_name == recipe.getElementsByClassName("recipe-title")[0].childNodes[3].innerHTML) {
                    break;
                }
                index++;
            }
            Recipes[index].breakpoint = !Recipes[index].breakpoint;
            Utils.log(`Breakpoint ${recipe.getElementsByClassName("recipe-title")[0].childNodes[1].innerHTML} : ${recipe.getElementsByClassName("recipe-title")[0].childNodes[3].innerHTML}`, "success");
            refreshRecipe();
        } );
        recbtnEventListeners.push(breakpoint);
    }

    // Bind ${operation.func_name}-up to move operation up in Recipe, and ${operation.func_name}-down to move operation down in Recipe
    for (let recipe of recipeList.childNodes) {
        // check if element is div with class "recipe"
        if (recipe.nodeName != "DIV" || recipe.className.split(" ")[0] != "recipe") {
            continue;
        }
        let up = document.getElementById(`${recipe.getAttribute("id")}-up`);
        let down = document.getElementById(`${recipe.getAttribute("id")}-down`);
        if (up != null) {
            up.addEventListener("click", function(e) {
                let index = 0
                for (let recp of Recipes) {
                    if (recp.func_name == recipe.getAttribute("id")) {
                        break;
                    }
                    index++;
                }
                let temp = Recipes[index];
                Recipes[index] = Recipes[index-1];
                Recipes[index-1] = temp;
                updateSelected();
            } );
            recbtnEventListeners.push(up);
        }
        if (down != null) {
            down.addEventListener("click", function(e) {
                let index = 0
                for (let recp of Recipes) {
                    if (recp.func_name == recipe.getAttribute("id")) {
                        break;
                    }
                    index++;
                }
                let temp = Recipes[index];
                Recipes[index] = Recipes[index+1];
                Recipes[index+1] = temp;
                updateSelected();
            } );
            recbtnEventListeners.push(down);
        }
    }

    // Bind to input[class=oddnumber] / input[class=evennumber] / input[class=boundnumber] to update recipe
    for (let recipe of recipeList.childNodes) {
        // check if element is div with class "recipe"
        if (recipe.nodeName != "DIV" || recipe.className.split(" ")[0] != "recipe") {
            continue;
        }
        let parameters = recipe.getElementsByClassName("recipe-parameters");
        for (let parameter of parameters) {
            for (let node of parameter.childNodes) {
                // check if element is div with class "recipe-parameter"
                if (node.nodeName != "DIV" || node.className != "recipe-parameter") {
                    continue;
                }

                let inputs = node.getElementsByTagName("input");
                for (let input of inputs) {
                    if (input == undefined) {
                        continue;
                    }
                    // Check if input has class="number" or class="oddnumber" or class="evennumber" or class="boundnumber"
                    if (input.getAttribute("class") == "number") {
                        // Bind to whenever input is changed, bake if auto bake is enabled
                        input.addEventListener("change", function(e) {
                            if (autobake) {
                                Utils.log("Autobake is enabled, baking recipe - number", "warning");
                                bakeRecipe();
                            }
                        });
                    } else if (input.getAttribute("class") == "oddnumber") {
                        // Bind to when input is changed, if value is odd, set value to value, else set value to value + 1
                        input.addEventListener("change", function(e) {
                            if (input.value % 2 == 0) {
                                let old = parseInt(input.value);
                                input.value = old + 1;
                                Utils.log(`${input.getAttribute("arg-name")} was even(${old}) when meant to be odd, changed to: ${input.value}`, "warning");
                            }
                            if (autobake) {
                                Utils.log("Autobake is enabled, baking recipe - oddnumber", "warning");
                                bakeRecipe();
                            }
                        } );
                    } else if (input.getAttribute("class") == "evennumber") {
                        // Bind to when input is changed, if value is even, set value to value, else set value to value - 1
                        input.addEventListener("change", function(e) {
                            if (input.value % 2 == 1) {
                                let old = parseInt(input.value);
                                input.value = old - 1;
                                Utils.log(`${input.getAttribute("arg-name")} was odd(${old}) when meant to be even, changed to: ${input.value}`, "warning");
                            }
                            if (autobake) {
                                Utils.log("Autobake is enabled, baking recipe - evennumber", "warning");
                                bakeRecipe();
                            }
                        } );
                    } else if (input.getAttribute("class") == "boundnumber") {
                        // Bind to when input is changed, if value is less than min, set value to min, else if value is greater than max, set value to max, else set value to value
                        input.addEventListener("change", function(e) {
                            let min = parseInt(input.getAttribute("min"));
                            let max = parseInt(input.getAttribute("max"));
                            if (input.value < min) {
                                let old = input.value;
                                input.value = min;
                                Utils.log(`${input.getAttribute("arg-name")} was less than ${min}(${old}) when meant to be equal or greater than ${min}, changed to: ${input.value}`, "warning");
                            } else if (input.value > max) {
                                let old = input.value;
                                input.value = max;
                                Utils.log(`${input.getAttribute("arg-name")} was greater than ${max}(${old}) when meant to be equal or less than ${max}, changed to: ${input.value}`, "warning");
                            }
                            if (autobake) {
                                Utils.log("Autobake is enabled, baking recipe - boudnumber", "warning");
                                bakeRecipe();
                            }
                        } );
                    }
                    changeEventListeners.push(input);
                }

                // check if has <select>
                let selects = node.getElementsByTagName("select");
                for (let select of selects) {
                    if (select == undefined) {
                        continue;
                    }
                    // Bind to whenever select is changed, bake if auto bake is enabled
                    select.addEventListener("change", function(e) {
                        if (autobake) {
                            Utils.log("Autobake is enabled, baking recipe - select", "warning");
                            bakeRecipe();
                        }
                    } );
                    changeEventListeners.push(select);
                }
            }
        }
    }

    if (autobake && depth == 0) {
        Utils.log("Autobake is enabled, baking recipe - refresh", "warning");
        bakeRecipe();
    }
}

function updateSelected(depth=0, load=false) {
    let currentOperations = {};
    if (depth == 0) {
        refreshRecipe(1);
    }
    for (let recipe of Recipes) {
        // Update Arguments within recipe.parameters[n].selected to reflect the selected option on webpage
        let func_div = document.getElementById(recipe.func_name)
        if (func_div == null) {
            continue;
        }
        let parameters = func_div.getElementsByClassName("recipe-parameters");
        let success = Utils.updateArguments(recipe, parameters, currentOperations, load);
        if (success) {
            //currentOperations[recipe.func_name] = recipe;
            currentOperations[recipe.func_name] = recipe.func_name;
        }
    }
    if (depth == 0) { // Must be called before and after to ensure that all recipes are updated -- and also cus my code is bad
        refreshRecipe(0);
    }
}

function safeImRead(imgEle) {
    // Opencv.js likes to break on random shit like imread so heres a function to make it "safe"
    try {
        let img = cv.imread(imgEle);
        return img;
    } catch (e) {
        try {
            // Hacky Way: for <img> elements get its src url, create a new <img> element, set its src to the url, and then read it, delete old <img> element and replace with new one
            let imgsrc = imgEle.getAttribute("src");
            let imgclass = imgEle.getAttribute("class") || "";
            let imgid = imgEle.getAttribute("id") || "";
            let newImg = document.createElement("img");
            newImg.setAttribute("src", imgsrc);
            newImg.setAttribute("class", imgclass);
            newImg.setAttribute("id", imgid);
            imgEle.parentNode.replaceChild(newImg, imgEle);
            let img = cv.imread(newImg);
            return img;
        } catch (e2) {
            Utils.log("safeImRead failed to read img", "error");
            Utils.log(e, "error");
            Utils.log(e2, "error");
            return null;
        }
    }
}

function bakeRecipe() {
    let imgElement = document.getElementById("INPUThiddenImageSourceSuperSecret");
    let outputImage = document.getElementById("output-image")
    // Check if image is loaded
    if (imgElement.src == "") {
        Utils.log(`No image loaded`, `error`);
        return;
    }
    try {
        var img = safeImRead(imgElement);
        if (img == null) {
            Utils.log(`Failed to read image for baking`, `error`);
            return;
        }
    } catch (e) {
        Utils.log(`Error loading image during baking`, `error`);
        Utils.log(`This Should never occur, only times it does is when opencv.js breaks due to AutoBake, only known fix is reloading the page`, `error`);
        Utils.log(e, `error`);
        Utils.log(`If this error persists, please contact the developer`, `error`);
        Utils.log(`Aborting baking`, `error`);
        throw e;
        return;
    }
    outputImage.innerHTML = ``
    // Check if Recipe is empty
    if (Recipes.length == 0) {
        Utils.log(`No recipe selected - Clearing output`, `error`);
        let canvasOutput = document.createElement("canvas");
        canvasOutput.setAttribute("class", "canvasOutput");
        canvasOutput.setAttribute("id", "canvasOutput");
        outputImage.appendChild(canvasOutput);
        cv.imshow("canvasOutput", img);
        cv.imshow("OUTPUThiddenImageSourceSuperSecret", img);
        return;
    }
    
    // Update selected arguments / parameters
    try {
        updateSelected(1);
    } catch (e) {
        Utils.log(`Internal Error updating selected arguments`, `error`);
        Utils.log(e, `error`);
        Utils.log(`Aborting bake`, `error`);
        throw e;
    }
    Utils.log(`Baking recipe`, `info`);

    let canvases = document.getElementsByClassName("hiddencanvasOutput");
    // destroy all canvases
    for (let canvas of canvases) {
        canvas.parentNode.removeChild(canvas);
    }

    // Record each step of the image
    steps = {};
    steps["Source"] = img.clone();

    let index = 0;
    for (let recipe of Recipes) {
        let func_name = recipe.func_name.replace(`_${recipe.index}`, ``);
        // Perform operation on image
        try {
            if (recipe.disabled == true) {
                Utils.log(`Recipe ${recipe.func_name} is disabled`, `warning`);
                index++;
                continue;
            }
            if (func_name == "bitwise_and") {
                img = recipe.run(img, steps)
            }else {
                img = recipe.run(img);
            }
            if (recipe.breakpoint && index < Recipes.length - 1) {
                // add new canvas to output-image
                let newCanvas = document.createElement("canvas");
                // add class "canvasOutput"
                newCanvas.setAttribute("class", "canvasOutput");
                // Add id recipe.func_name
                newCanvas.setAttribute("id", `${recipe.func_name}-canvas`);
                // Append to outputImage
                outputImage.appendChild(newCanvas);
                // Draw image to canvas
                cv.imshow(newCanvas, img);
                // Create new canvas for next step
                let hiddenCanvas = document.createElement("canvas");
                // add class "hiddencanvasOutput"
                hiddenCanvas.setAttribute("class", "hiddencanvasOutput");
                // Add id recipe.func_name
                hiddenCanvas.setAttribute("id", `${recipe.func_name}-hiddencanvas`);
                // Set display to none
                hiddenCanvas.style = "display: none;";
                // Append to outputImage
                document.body.appendChild(hiddenCanvas);
                // Draw image to canvas
                cv.imshow(hiddenCanvas, img);
            }
            steps[recipe.func_name] = img.clone();
        } catch (e) {
            var tempimg = safeImRead(document.getElementsByClassName("imageSrc")[0]);
            if (tempimg == null) {
                Utils.log(`Failed to read temp image for error logging`, `error`);
            }
            Utils.log(`Error performing ${recipe.func_name}, this is usually due to using the function wrong, such as an iamge having incorrect channels (correct: 1/3/4), or a paramter value is set incorrectly`, `error`);
            Utils.log(e, `error`);
            Utils.log(`True Image Details: ${img.cols}x${img.rows}x${img.channels()} | Display Image Details: ${tempimg.cols}x${tempimg.rows}x${tempimg.channels()}`, `error`);
            Utils.log(`Aborting bake`, `error`);
            tempimg.delete();
            img.delete();
            throw e; 
            return;
        }
        Utils.log(`${recipe.name} : ${recipe.func_name}`, "success");
        index++;
    }
    
    // Show image on webpage
    // <canvas class="canvasOutput" id="canvasOutput"></canvas>
    let canvasOutput = document.createElement("canvas");
    canvasOutput.setAttribute("class", "canvasOutput");
    canvasOutput.setAttribute("id", "canvasOutput");
    outputImage.appendChild(canvasOutput);
    try {
        cv.imshow(canvasOutput, img);
        cv.imshow("OUTPUThiddenImageSourceSuperSecret", img);
    } catch (e) {
        let tempimg = safeImRead(document.getElementsByClassName("imageSrc")[0]);
        if (tempimg == null) {
            Utils.log(`Failed to read temp image for error logging`, `error`);
        }
        Utils.log(`Error displaying image`, `error`);
        Utils.log(e, `error`);
        // Log image details in one line
        Utils.log(`True Image Details: ${img.cols}x${img.rows}x${img.channels()} | Display Image Details: ${tempimg.cols}x${tempimg.rows}x${tempimg.channels()}`, `error`);
        tempimg.delete();
        img.delete();
        throw e;
    }
    
    Utils.log(`Image baked`, `golden`);
    var tempimg = safeImRead(document.getElementsByClassName("imageSrc")[0]);
    if (tempimg == null) {
        Utils.log(`Failed to read temp image for info logging`, `error`);
    }
    Utils.log(`True Image Details: ${img.cols}x${img.rows}x${img.channels()} | Type: ${img.type()} | Depth: ${img.depth()}`, `info`);
    Utils.log(`Display Image Details: ${tempimg.cols}x${tempimg.rows}x${tempimg.channels()} | Type: ${tempimg.type()} | Depth: ${tempimg.depth()}`, `info`);
    tempimg.delete();
    img.delete();
    

    // Update workspace-wrapper height
    setTimeout(() => {
        document.getElementById("workspace-wrapper").setAttribute(`style`, `height:${window.innerHeight - 70}px;`)
    }, 100);
}


function main(){
    // Setup
    setupOperations();
    updateSelected(); // this calls refreshRecipe for us
    

    // Setup Bake button
    let bake = document.getElementById("bake-button");
    bake.addEventListener("click", function(){
        bakeRecipe();
    });


    // Detect if image is added to input
    document.getElementById("fileInput").addEventListener("change", function(e){
        setupImage(e);
    });

    // Save output image
    document.getElementById("output-save-button").addEventListener("click", function(){
        // check if "document.getElementById("OUTPUThiddenImageSourceSuperSecret")" is empty <img>
        if (document.getElementById("OUTPUThiddenImageSourceSuperSecret").src == "") {
            Utils.log(`No image to save`, `error`);
            return;
        }
        Utils.log(`Saving Output Image - DOES NOT SAVE BREAKPOINT, ONLY FINAL OUTPUT IMAGE`, `info`);
        let getimg = document.getElementById("OUTPUThiddenImageSourceSuperSecret");
        let trueimg = cv.imread(getimg);
        // Get data url from canvas
        let dataURL = getimg.toDataURL("image/png");
        // Create a link to the data url
        let link = document.createElement("a");
        link.download = "imagechef_output.png";
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
            document.body.removeChild(link);
            Utils.log(`Output image has been served. Cannot Confirm if it was saved.`, "success");
            Utils.log(`Image Details: ${trueimg.cols}x${trueimg.rows}x${trueimg.channels()} | Type: ${trueimg.type()} | Depth: ${trueimg.depth()}`, `info`);
            trueimg.delete();
        }, 0);
    });

    // Detect if search has changed / new text is entered
    document.getElementById("operation-search-input").addEventListener("input", function(e){
        setupOperations();
    } );

    // Recipe Save / Load / Clear
    document.getElementById("clear-button").addEventListener("click", function(){
        Recipes = [];
        updateSelected();
    } );

    document.getElementById("save-button").addEventListener("click", function(){
        Utils.log(`Saving recipe`, `info`);
        Utils.saveRecipe(Recipes);
    });

    document.getElementById("codeify-button").addEventListener("click", function(){
        Utils.log(`Codeifying recipe`, `info`);
        if (Recipes.length == 0) {
            Utils.log(`No recipe to save`, `error`);
            return;
        }
        let [jsonifyed, filename] = Utils.convertRecipe(Recipes); // This converts the recipe into a usable format for codeGenerator
        let recipeParsed = JSON.parse(jsonifyed);
        filename = filename.replace("_recipe_", "_code_");
        let language = document.getElementById("codeify-language").value; // temp python, will add value to settings so you can choose language
        // Change filename ending to match language
        if (language == "python") {
            filename = filename.replace(".json", ".py");
        } else if (language == "javascript") {
            filename = filename.replace(".json", ".js");
        } else {
            Utils.log(`Invalid language selected`, `error`);
            return;
        }
        document.getElementById("codeify-title-display").innerHTML = `Codeify - ${filename}`;
        document.getElementById("codeify-overlay").style.display = "block";
        document.getElementById("codeify-overlay").hidden = false;
        document.getElementById("codeify-overlay").classList.add("fade-in");
        setTimeout(() => {
            document.getElementById("codeify-overlay").classList.remove("fade-in");
            codeify_overlay = true;
        }, 500);

        

        let codeGenerator = new CodeGenerator();
        codeGenerator.generateRecipe(recipeParsed);
        let code = codeGenerator.generateCode(language); 
        let codeify_display = document.getElementById("codeify-save-display");
        codeify_display.classList = `language-${language}`;
        // add text from allLanguage[lang]
        codeify_display.innerHTML = code
        // highlight code
        Prism.highlightElement(codeify_display);
        /*
        let file = new Blob([code], {type: "text/plain"});
        if (window.navigator.msSaveOrOpenBlob) { // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        } else { // Backup Method
            let a = document.createElement("a");
            let url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                Utils.log(`Codeify save has been served. Cannot Confirm if it was saved.`, "success");
            }, 0);
        }
        */
    });

    document.getElementById("codeify-overlay-save").addEventListener("click", function(){
        let codeify_display = document.getElementById("codeify-save-display");
        let code = codeify_display.innerText;
        let filename = document.getElementById("codeify-title-display").innerHTML.replace("Codeify - ", "");
        let file = new Blob([code], {type: "text/plain"});
        if (window.navigator.msSaveOrOpenBlob) { // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        } else { // Backup Method
            let a = document.createElement("a");
            let url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                Utils.log(`Codeify save has been served. Cannot Confirm if it was saved.`, "success");
            }, 0);
        }
    });


    document.getElementById("load-input").addEventListener("change", function(e){
        Utils.log(`Loading recipe`, `info`);
        Utils.loadRecipe(e, Recipes, Operations);
        setTimeout(() => {
            updateSelected(0, true); // second variable = loading == true, a hacky variable to make sure bitwise_and loads properly, very bad code but i cba anymore
            if (Recipes.length == 0) {
                Utils.log(`Recipe failed to load`, `error`);
                return;
            }
            Utils.log(`Recipe loaded`, `success`);
            if (Recipes.length > 0 && document.getElementById("INPUThiddenImageSourceSuperSecret").src != "") {
                bakeRecipe();
            }
        }, 1000);
    });

    // Bind Preloaded / Settings to there overlay - Ugly Code but it works
    var preloaded_overlay = false;
    var settings_overlay = false;
    var codeify_overlay = false;
    document.getElementById("preloaded-abutton").addEventListener("click", function(){
        document.getElementById("preloaded-overlay").style.display = "block";
        document.getElementById("preloaded-overlay").hidden = false;
        document.getElementById("preloaded-overlay").classList.add("fade-in");
        setTimeout(() => {
            document.getElementById("preloaded-overlay").classList.remove("fade-in");
            preloaded_overlay = true;
        }, 500);
    });
    document.getElementById("preloaded-overlay-close").addEventListener("click", function(){
        document.getElementById("preloaded-overlay").classList.add("fade-out");
        setTimeout(() => {
            document.getElementById("preloaded-overlay").style.display = "none";
            document.getElementById("preloaded-overlay").hidden = true;
            document.getElementById("preloaded-overlay").classList.remove("fade-out");

            preloaded_overlay = false;
        }, 500);
    });
    document.getElementById("settings-abutton").addEventListener("click", function(){
        document.getElementById("settings-overlay").style.display = "block";
        document.getElementById("settings-overlay").hidden = false;
        document.getElementById("settings-overlay").classList.add("fade-in");
        setTimeout(() => {
            document.getElementById("settings-overlay").classList.remove("fade-in");
            settings_overlay = true;
        }, 500);
    });
    document.getElementById("settings-overlay-close").addEventListener("click", function(){
        document.getElementById("settings-overlay").classList.add("fade-out");
        setTimeout(() => {
            document.getElementById("settings-overlay").style.display = "none";
            document.getElementById("settings-overlay").hidden = true;
            document.getElementById("settings-overlay").classList.remove("fade-out");

            settings_overlay = false;
        }, 500);
    });
    document.getElementById("codeify-overlay-close").addEventListener("click", function(){
        document.getElementById("codeify-overlay").classList.add("fade-out");
        setTimeout(() => {
            document.getElementById("codeify-overlay").style.display = "none";
            document.getElementById("codeify-overlay").hidden = true;
            document.getElementById("codeify-overlay").classList.remove("fade-out");

            codeify_overlay = false;
        }, 500);
    });

    document.body.addEventListener("click", function(e){ // Close overlay if clicked outside
        let overlaycont = false;
        for (let i = 0; i < e.composedPath().length; i++) {
            if (e.composedPath()[i].classList && e.composedPath()[i].classList.contains("overlay-content")) {
                overlaycont = true;
                break;
            }
        }
        if (preloaded_overlay && !overlaycont) {
            document.getElementById("preloaded-overlay").classList.add("fade-out");
            setTimeout(() => {
                document.getElementById("preloaded-overlay").style.display = "none";
                document.getElementById("preloaded-overlay").hidden = true;
                document.getElementById("preloaded-overlay").classList.remove("fade-out");

                preloaded_overlay = false;
            }, 500);
        } else if (settings_overlay && !overlaycont) {
            document.getElementById("settings-overlay").classList.add("fade-out");
            setTimeout(() => {
                document.getElementById("settings-overlay").style.display = "none";
                document.getElementById("settings-overlay").hidden = true;
                document.getElementById("settings-overlay").classList.remove("fade-out");

                settings_overlay = false;
            }, 500);
        } else if (codeify_overlay && !overlaycont) {
            // check if e.target is <a> element with download attribute
            if (e.target.tagName === "A" && e.target.hasAttribute("download")) {
                return;
            }
            document.getElementById("codeify-overlay").classList.add("fade-out");
            setTimeout(() => {
                document.getElementById("codeify-overlay").style.display = "none";
                document.getElementById("codeify-overlay").hidden = true;
                document.getElementById("codeify-overlay").classList.remove("fade-out");

                codeify_overlay = false;
            }, 500);
        }
    });

    // Hookeup autobake button (checkbox)
    document.getElementById("autobake-boolean").addEventListener("change", function(e){
        if (e.target.checked) {
            Utils.log(`Autobake enabled`, `info`);
            autobake = true;
        } else {
            Utils.log(`Autobake disabled`, `info`);
            autobake = false;
        }
    });
    autobake = document.getElementById("autobake-boolean").checked;

    // detect when document.getElementById("codeify-language").value changes
    document.getElementById("codeify-language").addEventListener("change", function(e){
        let lang = e.target.value;
        // replace the code block with the new language
        let codeify_display = document.getElementById("codeify-display");
        codeify_display.classList = `language-${lang}`;
        // Update codeify-explain
        document.getElementById("codeify-explain").innerHTML = `Example Codeify of ${lang[0].toUpperCase() + lang.slice(1)}`;
        // add text from allLanguage[lang]
        codeify_display.innerHTML = allLanguage.default[lang];
        // highlight code
        Prism.highlightElement(codeify_display);
    });

    // Initiate Codeify Display
    document.getElementById("codeify-display").classList = `language-${document.getElementById("codeify-language").value}`;
    document.getElementById("codeify-explain").innerHTML = `Example Codeify of ${document.getElementById("codeify-language").value[0].toUpperCase() + document.getElementById("codeify-language").value.slice(1)}`;
    document.getElementById("codeify-display").innerHTML = allLanguage.default[document.getElementById("codeify-language").value];
    Prism.highlightElement(document.getElementById("codeify-display"));

    // Add some bits to recipe
    //clickDetection("cvtColor_1", "mix");
    //clickDetection("blur_2", "mix");
    //clickDetection("threshold_3", "mix");
    //clickDetection("findContours_4", "mix");
    //refreshRecipe();
}
