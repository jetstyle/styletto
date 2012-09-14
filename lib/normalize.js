"use strict";

var path = require( 'path' );
var fs   = require( 'fs' );

var processor = require( './processor' );

var err = '';

var errorReportingModes = [ 'error', 'alert', 'ignore' ];

var BASE64_SIZE = '10000';

module.exports = function( params, callback ) {

    // resolving path rules

    if ( params.path === undefined ) {

        err += '\n You must specify path.';

    }


    // resolving errors rules

    if ( params.errors === undefined ) {

        params.errors = {};

    }

    if ( params.errors.imports === undefined ) {

        params.errors.imports = 'alert';

    }

    else if ( errorReportingModes.indexOf( params.errors.imports ) === -1 ) {

        err += '\n' + params.errors.imports + ' is not an acceptable imports value.';

    }

    if ( params.errors.resources === undefined ) {

        params.errors.resources = 'ignore';

    }

    else if ( errorReportingModes.indexOf( params.errors.resources ) === -1 ) {

        err += '\n' + params.errors.resources + ' is not an acceptable resources value.';

    }

    if ( params.errors.processors === undefined ) {

        params.errors.processors = 'error';

    }

    else if ( errorReportingModes.indexOf( params.errors.processors ) === -1 ) {

        err += '\n' + params.errors.processors + ' is not an acceptable processors value.';

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

        err += '\n' + params.compress + ' is not an acceptable compress value.';

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

        err += '\n' + params.base64 + ' is not an acceptable base64 value.';

    }


    // validating input files

    var pathToInput;

    if ( params.input === undefined ) {

        err += '\nNo input file specified.';

    } else if ( ( typeof params.input ) === 'string' ) {

        params.input = [params.input];

    }

    for ( var i = 0; i < params.input.length; i++ ) {

        pathToInput = validatePath( params.input[i], params.path );

        if ( pathToInput ) {

            params.input[i] = pathToInput;

        } else {

            err += '\nWrong path or type of file: "' + params.input[i] + '".';

        }
    }


    // validating output file

    if ( params.output ) {

        params.exists = ( validatePath( params.output, params.path ) !== false );

    }


    // check for errors

    if ( err === '' ) {

        err = false;

    }

    // return results

    return callback( err, params );

};


var validatePath = exports.validatePath = function( filePath, dir ) {

    var typeIsCSS =  processor.check( path.extname( filePath ) );

    var pathIsAbsolute = ( path.resolve( filePath ) === filePath );

    var patIsAbsoluteAndExist = ( pathIsAbsolute && ( fs.existsSync( path.resolve( filePath ) ) === true ) );

    var pathExist = ( fs.existsSync( path.join( dir, filePath ) ) === true );

    if ( typeIsCSS && patIsAbsoluteAndExist ) {

        return filePath;

    } else if ( typeIsCSS && pathExist ) {

        return path.join( dir, filePath );

    } else {

        return false;

    }

};
