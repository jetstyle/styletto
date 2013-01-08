"use strict";

var path = require( 'path' ),
    fs   = require( 'fs' ),
    colors   = require( 'colors' ),

    processor = require( './processor' ),

    errorReportingModes = [ 'error', 'alert', 'ignore' ],

    BASE64_SIZE = '10000',

    BASE64_TYPES = {
        'gif':  'image/gif',
        'png':  'image/png',
        'jpg':  'image/jpeg',
        'jpeg': 'image/jpeg',
        'svg':  'image/svg+xml'
    };

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


    // resolving base64 rules

    if ( params.base64 === undefined ) {

        params.base64 = false;

    }

    else if ( params.base64 === true ) {

        params.base64 = {
            limit: BASE64_SIZE,
            types: BASE64_TYPES
        };

    }

    else if (typeof params.base64 === 'number' ) {

        params.base64 = {
            limit: params.base64,
            types: BASE64_TYPES
        };

    }

    // right now if params exists it must be Object


    if ( params.base64 ) {

        if ( typeof params.base64 !== 'object' ) {

            err += 'Error! '.red + 'Not acceptable base64 value: "' + params.base64 + '". It must be object.\n';

        }

        else {

            var isIntBase64LimitValue = ( ( parseFloat( params.base64.limit ) == parseInt( params.base64.limit, 10 ) ) && !isNaN( params.base64.limit ) );

            if ( !isIntBase64LimitValue ) {

                err += 'Error! '.red + 'Not acceptable base64.limit value: "' + params.base64.limit + '". It must be number.\n';

            }

            var isObjectBase64TypesValue = ( typeof params.base64.types === 'object' );

            if ( !isObjectBase64TypesValue ) {

                err += 'Error! '.red + 'Not acceptable base64.types value: "' + params.base64.types + '". It must be object.\n';

            }

        }

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
