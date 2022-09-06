import Utils from "../Utils.mjs";

class bitwise_not {
  constructor() {
        // Default parameters
        this.index = Utils.RunningIndex();
        this.func = bitwise_not;
        this.func_name = `bitwise_not_${this.index}`;
        this.name = "Bitwise NOT";
        this.description = "Performs a bitwise NOT operation on an image. Black becomes white and white becomes black.";
        this.breakpoint = false;
        this.disabled = false;
        this.parameters = {

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
        if (input.channels() != 1) {
            Utils.log(`The image has ${input.channels()} channels, in order to see the result of bitwise_not make sure to convert it to 1 channel! (Gray / Black and White)`, "warning");
        }
        let fin = cv.bitwise_not(input, input);
        if (fin == undefined) {
            return input
        }
        return fin
    }
}

export default bitwise_not;