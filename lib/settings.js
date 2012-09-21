"use strict";

var path = require( 'path' );
var fs   = require( 'fs' );

var colors   = require( 'colors' );

var processor = require( './processor' );

module.exports = function ( args ) {

    var config = false;
    var input  = false;
    var output = false;
    var params = {};


    // looking for path to files

    var unnamedArguments = args._;

    for ( var i = 0; i < unnamedArguments.length; i++ ) {

        var item = unnamedArguments[ i ];

        var configPath = /\.json/.test( item );
        var stylePath  = processor.check( path.extname( item ) );

        if ( configPath ) {

            config = item;

        }

        if ( stylePath && !input && !config ) {

            input = item;

        }

        var noRepeat = ( item !== input && item !== config );

        if ( stylePath && noRepeat && ( input || config ) ) {

            output = item;

        }

    }

    // importing config values or throwing error

    if ( config ) {

        var fullConfigPath = ( args.path ) ? path.resolve( args.path, config ) : path.resolve( config );

        if ( fs.existsSync( fullConfigPath ) ) {

            params = JSON.parse( fs.readFileSync( fullConfigPath ) );

            var localConfigPath = path.dirname( config );

            params.path = ( params.path ) ? path.join( localConfigPath, params.path ) : localConfigPath;

            params.path = ( args.path ) ? path.join( args.path, localConfigPath ) : params.path;

        }

        else {

            return new Error( 'Error!'.red + ' Config file not found at provided path.' );

        }

    }

    else if ( input ) {

        params.input = input;

        params.path = ( args.path ) ? args.path : process.cwd();

    }

    else {

        return new Error( 'Error!'.red + ' You need to send config or style file.' );

    }

    if ( output ) {

        params.output = output;

    }

    // resolving compression flag

    if ( args.c === true ) {

        params.compress = true;

    }

    if ( args.compress !== undefined ) {

        params.compress = args.compress;

    }

    // resolving base64 flag

    if ( args.b === true ) {

        params.base64 = true;

    }

    if ( args.base64 !== undefined ) {

        switch ( args.base64 ) {

            case 'true':
                params.base64 = true;
                break;

            case false:
                // moving on, nothing to look at here

            case 'false':
                params.base64 = false;
                break;

            default:
                params.base64 = args.base64;
                break;
        }

    }


    // resolve error reporting preferences

    var hasErrorsPrefs = (  args[ 'errors-imports' ] || args[ 'errors-resources' ] || args[ 'errors-processors' ] );

    if ( hasErrorsPrefs ) {

        params.errors = {};

        if ( args[ 'errors-imports' ] ) {

            params.errors.imports = args[ 'errors-imports' ];

        }

        if ( args[ 'errors-resources' ] ) {

            params.errors.resources = args[ 'errors-resources' ];

        }

        if ( args[ 'errors-processors' ] ) {

            params.errors.processors = args[ 'errors-processors' ];

        }

        if ( args.errors ) {

            params.errors.imports    = ( params.errors.imports ) ? params.errors.imports : args.errors;
            params.errors.resources  = ( params.errors.resources ) ? params.errors.resources : args.errors;
            params.errors.processors = ( params.errors.processors ) ? params.errors.processors : args.errors;

        }

    }

    else if ( args.errors ) {

        params.errors = args.errors;

    }

    // returns params

    return params;

};
