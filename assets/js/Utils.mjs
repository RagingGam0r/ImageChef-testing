var index_running = 0;

class Utils {
    static toOperationHtmlOLD(operation){
        return `
        <div class='operation'>
            <div class='operation-title'>
            <h1>${operation.name}</h1>
            </div>
            <div class='operation-description'>
                <p>${operation.description}</p>
            </div>
            <div class='operation-button'>
                <input type='submit' value='Mix' class='mix' id='${operation.func_name}-mix'></input>
            </div>
        </div>`
    }

    static toOperationHtml(category, expanded, operations){
        let html = `
        <div class='category'>
            <div class='category-title'>
                <h1 id="${category}-button">${category}</h1>
            </div>
            <div class='category-list' id='${category}-list' style="display: ${expanded == true ? "block" : "none"};">`
        for (let operation of operations) {
            html += `
            <div class='operation'>
                <div class='operation-title'>
                    <h1>${operation.name}</h1>
                </div>
                <div class='operation-description'>
                    <p>${operation.description}</p>
                </div>
                <div class='operation-button'>
                    <input type='submit' value='Mix' class='mix' id='${operation.func_name}-mix'></input>
                </div>
            </div>`
        }
        html += `
            </div>
        </div>`
        return html
    }

    static toRecipeHtml(operation, index, maxindex){
        let html = `
        <div class="recipe${operation.disabled == true ? " disabled" : ""}${operation.breakpoint == true ? " breakpoint" : ""}" id="${operation.func_name}" index="${index}">
            <div class="recipe-title">
                <h1>${operation.name}</h1>
                <h5>${operation.func_name}</h5>
            </div>
            <div class="recipe-remove">
                <button id="${operation.func_name}-remove" title="Delete Recipe"><h5></h5><span class="material-symbols-outlined">delete</span></button>
            </div>
            <div class="recipe-control">`
        if (operation.disabled == false) {
            html += `<button class="disable" id="${operation.func_name}-disable" title="Disable Recipe"><h5></h5><span class="material-symbols-outlined">block</span></button>`
        } else {
            html += `<button class="enable" id="${operation.func_name}-enable" title="Enable Recipe"><h5></h5><span class="material-symbols-outlined">block</span></button>`
        }
        if (operation.breakpoint == false) {
            html += `<button class="addbreak" id="${operation.func_name}-breakpoint" title="Add Breakpoint"><h5></h5><span class="material-symbols-outlined">add</span></button>`
        } else {
            html += `<button class="removebreak" id="${operation.func_name}-breakpoint" title="Remove Breakpoint"><h5></h5><span class="material-symbols-outlined">remove</span></button>`
        }
        html += `</div>`
        
        html += ` <div class="recipe-arrows">`
        if (maxindex >= 1) { // This took me way too long to figure out
            if (index > 0) {   
                html += `<button id="${operation.func_name}-up" title="Move Recipe Up"><span class="material-symbols-outlined">expand_less</span></button>`
            }
            if (index < maxindex) {
                html += `<button id="${operation.func_name}-down" title="Move Recipe Down"><span class="material-symbols-outlined">expand_more</span></button>`
            }
        }
        html += `</div>
            <div class="recipe-parameters">`

        for (let key of Object.keys(operation.parameters)){
            let parameter = operation.parameters[key];
            switch (parameter.type){
                case "comment":
                    /*
                    <h5 class="recipe-comment">This is a testing recipe ingredient, you should not see this under any circumstances</h5>
                    */
                    html += `<div class="recipe-parameter">`
                    html += `<h5 class="recipe-comment">${key}</h5>`
                    html += `</div>`
                    break;
                case "array":
                    /*
                    html += `
                    <select class="recipe-dropdown" arg-name="Colour Space">
                    <option>GrayScaleV0</option>
                    <option>GrayScaleV1</option>
                    <option>GrayScaleV2</option>
                    <option>GrayScaleV3</option>
                    <option>GrayScaleV4</option>
                    <option>GrayScaleV5</option>
                    </select>
                    `
                    */
                    html += `<div class="recipe-parameter">`
                    html += `<h5>${key}</h5>`
                    html += `<select class="recipe-dropdown" arg-name="` + key + `">`
                    for (let operationKey of Object.keys(parameter.options)){
                        if (operationKey == parameter.selected){
                            html += `<option selected>${operationKey}</option>`
                        } else {
                            html += `<option>${operationKey}</option>`
                        }
                    }
                    html += `</select>`
                    html += `</div>`
                    break;
                case "boolean":
                    /*
                    <input type="checkbox" class="boolean" arg-name="UnChecked"></input>
                    <input type="checkbox" class="boolean" arg-name="Checked" checked></input>
                    */
                    html += `<div class="recipe-parameter">`
                    html += `<h5>${key}</h5>`
                    html += `<input type="checkbox" class="boolean" arg-name="${key}" ${parameter.selected ? "checked" : ""}></input>`
                    html += `</div>`
                    break;
                case "number":
                    // <input type="number" class="number" arg-name="Base" value="0"></input>
                    html += `<div class="recipe-parameter">`
                    html += `<h5>${key}</h5>`
                    html += `<input type="number" class="number" arg-name="${key}" value="${parameter.selected}"></input>`
                    html += `</div>`
                    break;
                case "boundnumber":
                    // <input type="number" class="boundnumber" arg-name="Bound" min="0" max="255" value="255"></input>
                    html += `<div class="recipe-parameter">`
                    html += `<h5>${key}</h5>`
                    html += `<input type="number" class="boundnumber" min="${parameter.options[0]}" max="${parameter.options[1]}"arg-name="${key}" value="${parameter.selected}"></input>`
                    html += `</div>`
                    break;
                case "oddnumber":
                    // <input type="number" class="oddnumber" arg-name="Odd" value="1"></input>
                    html += `<div class="recipe-parameter">`
                    html += `<h5>${key}</h5>`
                    html += `<input type="number" class="oddnumber" arg-name="${key}" value="${parameter.selected}"></input>`
                    html += `</div>`
                    break;
                case "evennumber":
                    // <input type="number" class="evennumber" arg-name="Even" value="0"></input>
                    html += `<div class="recipe-parameter">`
                    html += `<h5>${key}</h5>`
                    html += `<input type="number" class="evennumber" arg-name="${key}" value="${parameter.selected}"></input>`
                    html += `</div>`
                    break;
                // Variants of above numbers, but as kernel input, could probably be done better but i dont know switch cases / javascript well enough
                case "kernelnumber":
                    /*
                    <div class="kernel_LB"><h5>(</h5></div>
                    <input type="kernelnumber" arg-name="Kernel_X", value="3"></input>
                    <div class="kernel_C"><h5>,</h5></div>
                    <input type="kernelnumber" arg-name="Kernel_Y", value="3"></input>
                    <div class="kernel_RB"><h5>)</h5></div>
                    */
                    html += `<div class="recipe-parameter">`
                    html += `<h5>${key}</h5>`
                    html += `<div class="kernel_LB"><h5>(</h5></div>`
                    html += `<input type="kernelnumber" class="number" arg-name="${key}_X" value="${parameter.selected[0]}"></input>`
                    html += `<div class="kernel_C"><h5>,</h5></div>`
                    html += `<input type="kernelnumber" class="number" arg-name="${key}_Y" value="${parameter.selected[1]}"></input>`
                    html += `<div class="kernel_RB"><h5>)</h5></div>`
                    html += `</div>`
                    break;
                case "boundkernelnumber":
                    /*
                    <div class="kernel_LB"><h5>(</h5></div>
                    <input type="kernelnumber" class="boundnumber" arg-name="Kernel_X", value="3"></input>
                    <div class="kernel_C"><h5>,</h5></div>
                    <input type="kernelnumber" class="boundnumber" arg-name="Kernel_Y", value="3"></input>
                    <div class="kernel_RB"><h5>)</h5></div>
                    */
                    html += `<div class="recipe-parameter">`
                    html += `<h5>${key}</h5>`
                    html += `<div class="kernel_LB"><h5>(</h5></div>`
                    html += `<input type="kernelnumber" class="boundnumber" arg-name="${key}_X" min="${parameter.options[0][0]}" max="${parameter.options[0][1]}" value="${parameter.selected[0]}"></input>`
                    html += `<div class="kernel_C"><h5>,</h5></div>`
                    html += `<input type="kernelnumber" class="boundnumber" arg-name="${key}_Y" min="${parameter.options[1][0]}" max="${parameter.options[1][1]}" value="${parameter.selected[1]}"></input>`
                    html += `<div class="kernel_RB"><h5>)</h5></div>`
                    html += `</div>`
                    break;
                case "oddkernelnumber":
                    /*
                    <div class="kernel_LB"><h5>(</h5></div>
                    <input type="kernelnumber" class="oddnumber" arg-name="Kernel_X", value="3"></input>
                    <div class="kernel_C"><h5>,</h5></div>
                    <input type="kernelnumber" class="oddnumber" arg-name="Kernel_Y", value="3"></input>
                    <div class="kernel_RB"><h5>)</h5></div>
                    */
                    html += `<div class="recipe-parameter">`
                    html += `<h5>${key}</h5>`
                    html += `<div class="kernel_LB"><h5>(</h5></div>`
                    html += `<input type="kernelnumber" class="oddnumber" arg-name="${key}_X" value="${parameter.selected[0]}"></input>`
                    html += `<div class="kernel_C"><h5>,</h5></div>`
                    html += `<input type="kernelnumber" class="oddnumber" arg-name="${key}_Y" value="${parameter.selected[1]}"></input>`
                    html += `<div class="kernel_RB"><h5>)</h5></div>`
                    html += `</div>`
                    break;
                case "evenkernelnumber":
                    /*
                    <div class="kernel_LB"><h5>(</h5></div>
                    <input type="kernelnumber" class="evennumber" arg-name="Kernel_X", value="3"></input>
                    <div class="kernel_C"><h5>,</h5></div>
                    <input type="kernelnumber" class="evennumber" arg-name="Kernel_Y", value="3"></input>
                    <div class="kernel_RB"><h5>)</h5></div>
                    */
                    html += `<div class="recipe-parameter">`
                    html += `<h5>${key}</h5>`
                    html += `<div class="kernel_LB"><h5>(</h5></div>`
                    html += `<input type="kernelnumber" class="evennumber" arg-name="${key}_X" value="${parameter.selected[0]}"></input>`
                    html += `<div class="kernel_C"><h5>,</h5></div>`
                    html += `<input type="kernelnumber" class="evennumber" arg-name="${key}_Y" value="${parameter.selected[1]}"></input>`
                    html += `<div class="kernel_RB"><h5>)</h5></div>`
                    html += `</div>`
                    break;
                case "scalarnumber":
                    /*
                    <div class="scalar_LB"><h5>(</h5></div>
                    <div class="scalar_I"><h5>R</h5></div>
                    <input type="scalarnumber" class="number" arg-name="Scalar_R" value="255"></input>
                    <div class="scalar_C"><h5>,</h5></div>
                    <div class="scalar_I"><h5>G</h5></div>
                    <input type="scalarnumber" class="number" arg-name="Scalar_G" value="255"></input>
                    <div class="scalar_C"><h5>,</h5></div>
                    <div class="scalar_I"><h5>B</h5></div>
                    <input type="scalarnumber" class="number" arg-name="Scalar_B" value="255"></input>
                    <div class="scalar_RB"><h5>)</h5></div>
                    options = [
                        "R",
                        "G",
                        "B"
                    ]
                    */
                    var K = Object.values(parameter.options); var [K10, K01, K20, K02, K30, K03] = [K[0], K[0], K[1], K[1], K[2], K[2]];
                    if (K10 == "1") { K01 = ""; } // Incase you dont want to show the name of option
                    if (K20 == "2") { K02 = ""; }
                    if (K30 == "3") { K03 = ""; }
                    html += `<div class="recipe-parameter">`
                    html += `<h5>${key}</h5>`
                    html += `<div class="scalar_LB"><h5>(</h5></div>`
                    html += `<div class="scalar_I"><h5>${K01}</h5></div>`
                    html += `<input type="scalarnumber" class="number" arg-name="${key}_${K10}" value="${parameter.selected[0]}"></input>`
                    html += `<div class="scalar_C"><h5>,</h5></div>`
                    html += `<div class="scalar_I"><h5>${K02}</h5></div>`
                    html += `<input type="scalarnumber" class="number" arg-name="${key}_${K20}" value="${parameter.selected[1]}"></input>`
                    html += `<div class="scalar_C"><h5>,</h5></div>`
                    html += `<div class="scalar_I"><h5>${K03}</h5></div>`
                    html += `<input type="scalarnumber" class="number" arg-name="${key}_${K30}" value="${parameter.selected[2]}"></input>`
                    html += `<div class="scalar_RB"><h5>)</h5></div>`
                    html += `</div>`
                    break;
                case "boundscalarnumber":
                    /*
                    <div class="scalar_LB"><h5>(</h5></div>
                    <div class="scalar_I"><h5>R</h5></div>
                    <input type="scalarnumber" class="number" arg-name="Scalar_R" value="255"></input>
                    <div class="scalar_C"><h5>,</h5></div>
                    <div class="scalar_I"><h5>G</h5></div>
                    <input type="scalarnumber" class="number" arg-name="Scalar_G" value="255"></input>
                    <div class="scalar_C"><h5>,</h5></div>
                    <div class="scalar_I"><h5>B</h5></div>
                    <input type="scalarnumber" class="number" arg-name="Scalar_B" value="255"></input>
                    <div class="scalar_RB"><h5>)</h5></div>
                    options = {
                        "R": [0, 255],
                        "G": [0, 255],
                        "B": [0, 255]
                    }
                    */
                    var K = Object.keys(parameter.options); var [K10, K01, K20, K02, K30, K03] = [K[0], K[0], K[1], K[1], K[2], K[2]]; var [V1, V2, V3] = [parameter.options[K10], parameter.options[K20], parameter.options[K30]];
                    if (K10 == "1") { K01 = ""; } // Incase you dont want to show the name of option
                    if (K20 == "2") { K02 = ""; }
                    if (K30 == "3") { K03 = ""; }
                    html += `<div class="recipe-parameter">`
                    html += `<h5>${key}</h5>`
                    html += `<div class="scalar_LB"><h5>(</h5></div>`
                    html += `<div class="scalar_I"><h5>${K01}</h5></div>`
                    html += `<input type="scalarnumber" class="boundnumber" arg-name="${key}_${K10}" value="${parameter.selected[0]}" min="${V1[0]}" max="${V1[1]}"></input>`
                    html += `<div class="scalar_C"><h5>,</h5></div>`
                    html += `<div class="scalar_I"><h5>${K02}</h5></div>`
                    html += `<input type="scalarnumber" class="boundnumber" arg-name="${key}_${K20}" value="${parameter.selected[1]}" min="${V2[0]}" max="${V2[1]}"></input>`
                    html += `<div class="scalar_C"><h5>,</h5></div>`
                    html += `<div class="scalar_I"><h5>${K03}</h5></div>`
                    html += `<input type="scalarnumber" class="boundnumber" arg-name="${key}_${K30}" value="${parameter.selected[2]}" min="${V3[0]}" max="${V3[1]}"></input>`
                    html += `<div class="scalar_RB"><h5>)</h5></div>`
                    html += `</div>`
                    break;
                default:
                    Utils.log(`Failed to find parameter type for ${key} : ${parameter.type}`, `error`);
                    break;
            }
        }
        html += `
            </div>
        </div>
        `
        return html;
    }

    static updateArguments(recipe, parameters, currentOperations, load=false) {
        let func_name = recipe.func_name.replace(`_${recipe.index}`, ``);
        if (func_name == "bitwise_and") {
            for (let paramkey of Object.keys(recipe.parameters)) {
                let param = recipe.parameters[paramkey];
                // Assign value to parameter
                param["options"] = {
                    
                };
                // Add currentOperations to bottom of options -- This is a hack to make sure that param["options"] doesnt have recipe.func_name in it
                // If i do param["options"] = currentOperations, then the recipe.func_name is somehow in it, but i cant remove it so yeah i have no idea
                for (let operationkey of Object.keys(currentOperations)) {
                    param["options"][operationkey] = currentOperations[operationkey];
                }
                param["options"]["Input"] = "Input";
                param["options"]["Source"] = "Source";
                if (paramkey == "Mask") {
                    param["options"]["None"] = "None";
                }
            }
        }
        for (let parameter of parameters) {
            for (let node of parameter.childNodes) {
                if (node.nodeType != 1) {
                    continue;
                }
                if (node.getElementsByClassName("recipe-comment").length > 0) {
                    continue;
                }
                if (node.getElementsByClassName("kernel_LB").length == 0 && node.getElementsByClassName("scalar_LB").length == 0) {
                    // Normal Inputs such as number, array, boolean, etc.
                    let grabvalue = node.getElementsByTagName("input")[0] || node.getElementsByTagName("select")[0];
                    let argName = grabvalue.getAttribute("arg-name");
                    let argValue = grabvalue.value == "on" ? grabvalue.checked : grabvalue.value // Grabs the value of the input or select element, if the value is "on" then it will return the checked value (boolean)
                    if (load==false){
                        recipe.parameters[argName].selected = argValue;
                    }
                    else{
                        grabvalue.value = recipe.parameters[argName].selected;
                }
                
                } else if (node.getElementsByClassName("kernel_LB").length > 0) {
                    // Kernel Inputs, they have two inputs instead of one like above
                    let grabX = node.getElementsByTagName("input")[0];
                    let grabY = node.getElementsByTagName("input")[1];
                    let argName = grabX.getAttribute("arg-name");
                    argName = argName.substring(0, argName.length - 2); // remove last two chars ("_X") from the argName to get the base argName
                    let argValue = [grabX.value, grabY.value];
                    recipe.parameters[argName].selected = argValue;
                } else if (node.getElementsByClassName("scalar_LB").length > 0) {
                    // Scalar Inputs, they have three inputs instead of two like above
                    let grabR = node.getElementsByTagName("input")[0];
                    let grabG = node.getElementsByTagName("input")[1];
                    let grabB = node.getElementsByTagName("input")[2];
                    let argName = grabR.getAttribute("arg-name");
                    argName = argName.substring(0, argName.length - 2); // remove last two chars ("_R") from the argName to get the base argName
                    let argValue = [grabR.value, grabG.value, grabB.value];
                    recipe.parameters[argName].selected = argValue;
                }
            }
        }
        return true;
    }

    static RunningIndex() {
        index_running += 1;
        return index_running - 1;
    }

    static countElements(element) {
        let count = 0;
        for (let i = 0; i < element.childNodes.length; i++) {
            if (element.childNodes[i].nodeType == 1) {
                count += 1;
            }
        }
        return count;
    }

    static overflowConsoleCheck(check) { // Should never have more than 10 <p> elements, but this is a backup incase something breaks
        // Check if check.childNodes has 10 <p> elements or more, if it does, repeat until only 10 <p> elements are left
        let count = Utils.countElements(check);
        while (count > 10) {
            check.removeChild(check.childNodes[0]);
            count = Utils.countElements(check); 
            // Update count - Would prefer to do -= 1, but for some reason it doesnt delete them all so this is the workaround but much worse.
            // Luckily we are working with a small amount of elements so it is fine.
        }
    }

    static log(message, type="bland") {
        /* type: bland, info, success, warning, error
        <p class="console-log-bland">Bland Notification</p>
        <p class="console-log-info">[I] Info Notification</p>
        <p class="console-log-success">[S] success Notification</p>
        <p class="console-log-warning">[W] Warning Notification</p>
        <p class="console-log-error">[E] Error Notification</p>
        */
        let consoleLog = document.getElementById("console-log");
        // Create new <p> element
        let newLog = document.createElement("p");
        // Set class
        newLog.className = "console-log-" + type;
        // Prefix message with [type]
        let firstChar = type.charAt(0);
        let prefix = `[${firstChar.toUpperCase()}] `;
        if (prefix == `[B]`) { // Remove prefix for bland
            prefix = ``;
        }
        // Set text
        newLog.innerHTML = `${prefix}${message}`;
        // Append to console log
        consoleLog.appendChild(newLog);
        // Log in developer console
        console.log(`${prefix}${message}`);
        // Prevent console log from overflowing
        Utils.overflowConsoleCheck(consoleLog);
    }

    static convertRecipe(recipeList) {
        let recipeConvert = {};
        recipeConvert["!__COMMENT__"] = `This is a JSON file generated by ImageChef. You can use the "load" button to load this recipe into ImageChef and start off from where you left off.`;
        recipeConvert["!__AUTHOR__"] = `RagingGam0r`;
        // Unique id, prevent overwriting on persons computer
        let uniqueId = Math.random().toString(36).substring(2, 15); // Generate a random string,
        let filename = `IMAGECHEF_recipe_${recipeList.length}_${uniqueId}.json`;
        for (let i = 0; i < recipeList.length; i++) {
            let recipe = recipeList[i];
            let recipeName = recipe.func_name
            let breakpoint = recipe.breakpoint;
            let disabled = recipe.disabled;
            recipeConvert[recipeName] = {
                "name": recipeName.replace(`_${recipe.index}`, ``),
                "breakpoint": breakpoint,
                "disabled": disabled,
                "parameters": {}
            };
            for (let key of Object.keys(recipe.parameters)) {
                let selected = recipe.parameters[key].selected;
                let index = recipe.parameters[key].index;
                recipeConvert[recipeName]["parameters"][key] = {
                    "selected": selected,
                    "index": index
                };

            }
        }
        return [JSON.stringify(recipeConvert, null, `\t`), filename];
    }

    static saveRecipe(recipeList) {
        if (recipeList.length == 0) {
            Utils.log(`No recipe to save`, `error`);
            return;
        }
        // Converts the recipeList array to json array
        let [jsonifyed, filename] = Utils.convertRecipe(recipeList);
        // Attempt to save as file
        let file = new Blob([jsonifyed], {type: "text/plain"});
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
                Utils.log(`Recipe save has been served. Cannot Confirm if it was saved.`, "success");
            }, 0);
        }
    }

    static loadRecipe(e, recp, Operations) {
        // Return RecipeList from JSON file
        var recipes = recp
        // e == file input element
        let file = e.target.files[0];
        // JSON parse the file
        let reader = new FileReader();
        reader.onload = function(e) {
            var lookupeqiv = {}
            let recipe = JSON.parse(reader.result);
            // Loop through each recipe
            for (let key of Object.keys(recipe)) {
                if (key.startsWith("!__")) { // Skip keys that are just string / comments
                    continue;
                }
                let name = recipe[key].name;
                let operation = new Operations[name].func();
                recipes.push(operation);
                lookupeqiv[key] = operation;
                let disabled = recipe[key].disabled;
                let breakpoint = recipe[key].breakpoint;
                operation.disabled = disabled;
                operation.breakpoint = breakpoint;
                for (let param of Object.keys(recipe[key]["parameters"])) {
                    let selected = recipe[key]["parameters"][param].selected;
                    if (Object.keys(lookupeqiv).includes(selected)) {
                        console.log(`Found ${selected} in ${key}, converting to ${lookupeqiv[selected].func_name}`);
                        selected = lookupeqiv[selected].func_name;
                    }
                    operation.parameters[param].selected = selected;
                }
            }
        }
        reader.readAsText(file);
    }
}

export default Utils;