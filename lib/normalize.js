"use strict";

var path = require( 'path' ),
    fs   = require( 'fs' ),
    colors   = require( 'colors' ),

    processor = require( './processor' ),

    errorReportingModes = [ 'error', 'alert', 'ignore' ],

    BASE64_SIZE = '10000';

module.exports = function( params, callback ) {

    var err = '';


    // resolving path rules

    if ( params.path === undefined ) {

        err += 'Error!'.red + ' You must specify path.\n';

    }

    params.path = path.resolve( params.path );


    // resolving errors rules

    if ( params.errors === undefined ) {

        params.errors = {};

    }

    else if ( ( typeof params.errors ) !== 'object' ) {

        if ( errorReportingModes.indexOf( params.errors ) === -1 ) {

            err += 'Error!'.red +  ' Not acceptable errors value: "' + params.errors + '".\n';

        }

        else {

            params.errors = {
                imports: params.errors,
                resources: params.errors,
                processors: params.errors
            };

        }

    }

    if ( params.errors.imports === undefined ) {

        params.errors.imports = 'alert';

    }

    else if ( errorReportingModes.indexOf( params.errors.imports ) === -1 ) {

        err += 'Error!'.red +  ' Not acceptable errors-imports value: "' + params.errors.imports + '".\n';

    }

    if ( params.errors.resources === undefined ) {

        params.errors.resources = 'ignore';

    }

    else if ( errorReportingModes.indexOf( params.errors.resources ) === -1 ) {

        err += 'Error!'.red +  ' Not acceptable errors-resources value: "' + params.errors.resources + '".\n';

    }

    if ( params.errors.processors === undefined ) {

        params.errors.processors = 'error';

    }

    else if ( errorReportingModes.indexOf( params.errors.processors ) === -1 ) {

        err += 'Error!'.red +  ' Not acceptable errors-processors value: "' + params.errors.processors + '".\n';

    }


    // resolving compress rules

    if ( params.compress === undefined ) {

        params.compress = false;

    }

    else if ( params.compress === true ) {

        params.compress = 'csso';

    }

    var notacceptableCompressValue = ( ( ( params.compress === false ) || ( params.compress === 'yui' ) || ( params.compress === 'csso' ) ) === false );

    if ( notacceptableCompressValue ) {

        err += 'Error!'.red + ' Not acceptable compress value: "' + params.compress + '".\n';

    }


    // resolving nib rules

    if ( params.nib === undefined ) {

        params.nib = 'vendor';

    }

    var notAcceptableNibValue = ( ( ( params.nib === false ) || ( params.nib === true ) || ( params.nib === 'vendor' ) ) === false );

    if ( notAcceptableNibValue ) {

        err += 'Error!'.red + ' Not acceptable nib value: "' + params.nib + '".\n';

    }


    // resolving base64 rules

    if ( params.base64 === undefined ) {

        params.base64 = false;

    }

    else if ( params.base64 === true ) {

        params.base64 = BASE64_SIZE;

    }

    var isIntBase64Value = ( ( parseFloat( params.base64 ) == parseInt( params.base64, 10 ) ) && !isNaN( params.base64 ) );

    var notacceptableBase64Value = ( ( ( params.base64 === false ) || isIntBase64Value ) === false );

    if ( notacceptableBase64Value ) {

        err += 'Error! '.red + 'Not acceptable base64 value: "' + params.base64 +'".\n';

    }


    // validating input files

    var pathToInput;

    if ( params.input === undefined ) {

        err += 'Error!'.red + 'No input file specified.\n';

    } else if ( ( typeof params.input ) === 'string' ) {

        params.input = [ params.input ];

    }

    for ( var i = 0; i < params.input.length; i++ ) {

        pathToInput = validatePath( params.input[i], params.path );

        if ( pathToInput ) {

            params.input[i] = pathToInput;

        }

        else {

            err += 'Error! '.red + 'Wrong path or type of file: "' + params.input[i] + '".\n';

        }
    }


    // validating output file

    if ( params.output ) {

        var pathToOutput = validatePath( params.output, params.path );

        params.exists = ( pathToOutput !== false );

        params.output = path.resolve( params.path, params.output );

        params.resolvePath = path.dirname( params.output );

    }

    else {

        params.resolvePath = params.path;

    }

    delete params.path;

    // check for errors

    if ( err !== '' ) {

        throw new Error( err );

    }

    // return results

    return params;

};


var validatePath = exports.validatePath = function( filePath, dir ) {

    var absolutePath = path.resolve( dir, filePath ),
        typeIsCSS    = processor.check( path.extname( filePath ) ),
        pathExist    = ( fs.existsSync( absolutePath ) === true );

    if ( typeIsCSS && pathExist ) {

        return absolutePath;

    }

    else {

        return false;

    }

};
