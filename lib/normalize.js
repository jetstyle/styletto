var path = require('path');

var err = '';

module.exports = function(params, dir) {

    params.basedir = dir;

    // setting unset variables

    params.compile = params.compile || false;

    params.base64  = params.base64  || false;

    // validate input files

    if (params.input === undefined) {

        err += "\nNo input file specified."

    } else if ((typeof params.input) === 'string') {


        var pathToInput = validatePath(params.input, params.basedir);
    
        if (pathToInput) {

            params.input = pathToInput;

        } else {

            err += '\nWrong path or type of file:"' + params.input + '".';

        }

    } else {

        for (var i = 0; i < params.input.length; i++) {

            var pathToInput = validatePath(params.input[i], params.basedir);

            if (pathToInput) {

                params.input[i] = pathToInput;

            } else {

                err += '\nWrong path or type of file: "' + params.input[i] + '".';

            }
        }

    }


    if (params.output) {

        params.output = path.join(params.basedir, params.output);
        params.exists = (validatePath(params.output, params.basedir) != false);

    }

    if (err != '') return new Error(err);

    else return params;

};


var validatePath = exports.validatePath = function(filePath, dir) {


    var typeIsCSS = (path.extname(filePath) === ('.css' || '.styl'));

    var pathIsAbsolute = (path.resolve(filePath) === filePath);

    var patIsAbsoluteAndExist = (pathIsAbsolute && (path.existsSync(path.resolve(filePath)) == true));

    var pathExist = (path.existsSync(path.join(dir, filePath)) == true);

    if (typeIsCSS && patIsAbsoluteAndExist) {

        return filePath;

    } else if (typeIsCSS && pathExist) {

        return path.join(dir, filePath);

    } else {

        return false;

    }

};