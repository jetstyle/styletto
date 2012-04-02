var path = require('path');

var err = '';

var BASE64_SIZE = '10000';

module.exports = function(params, dir) {


    // resolving basedir

    params.basedir = dir;


    // resolving compress rules

    if (params.compress === undefined) params.compress = false;

    else if (params.compress === true) params.compress = 'csso';

    var notAcceptedCompressValue = (((params.compress === false) || (params.compress === 'yui') || (params.compress === 'csso')) === false);

    if (notAcceptedCompressValue) err += '\n' + params.compress + ' is not an accepted compress value.';


    // resolving base64 rules

    if (params.base64 === undefined) params.base64 = false;

    else if (params.base64 === true) params.base64 = BASE64_SIZE;

    var isIntBase64Value = ((parseFloat(params.base64) == parseInt(params.base64)) && !isNaN(params.base64));

    var notAcceptedBase64Value = (((params.base64 === false) || isIntBase64Value) === false);

    if (notAcceptedBase64Value) err += '\n' + params.base64 + ' is not an accepted base64 value.';


    // validating input files

    if (params.input === undefined) {

        err += '\nNo input file specified.';

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


    // validating output file

    if (params.output) {

        params.output = path.join(params.basedir, params.output);
        params.exists = (validatePath(params.output, params.basedir) != false);

    }

    if (err != '') return new Error(err);

    else return params;

};


var validatePath = exports.validatePath = function(filePath, dir) {


    var typeIsCSS = ((path.extname(filePath) === '.css') || (path.extname(filePath) === '.styl'));

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