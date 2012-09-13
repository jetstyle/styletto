"use strict";

var path = require( 'path' );
var fs   = require( 'fs' );

var processor = require( './processor' );

module.exports = function ( args ) {

    var config;
    var params = {};


    // looking for path to files

    var unnamedArguments = args._;

    for ( var i = 0; i < unnamedArguments.length; i++ ) {

        var configPath      = /\.json/.test( unnamedArguments[i] );
        var stylePath       = processor.check( path.extname( unnamedArguments[ i ] ) );
        var inputUndefined  = ( params.input === undefined );

        if ( configPath ) {

            config = path.join( process.cwd(), unnamedArguments[i] );

        }

        if ( stylePath && inputUndefined ) {

            params.input = unnamedArguments[i];

        }

        var notEqualsInput = ( unnamedArguments[i] !== params.input );

        if ( stylePath && notEqualsInput && params.input ) {

            params.output = unnamedArguments[i];

        }

    }


    // importing config values or throwing error

    if ( config ) {

        if ( fs.existsSync( config ) ) {

            params = JSON.parse( fs.readFileSync( config ) );

            params.path  = ( params.path ) ? path.join( process.cwd(), params.path ) : path.dirname( config );

        }

        else {

            return new Error( 'Config file not found at provided path.' );

        }

    } else if ( params.input ) {

        params.path = ( args.path ) ? path.join( process.cwd(), args.path ) : process.cwd();
    }

    else {

        return new Error( 'You need to send config or style file.' );
    }


    // resolving compression flag

    if ( args.compress ) {

        params.compress = args.compress;

    }


    // resolving base64 flag

    if ( args.base64 ) {

        switch ( args.base64 ) {

            case true:
                // fall through
            case 'true':
                params.base64 = true;
                break;

            case false:
                // fall through
            case 'false':
                params.base64 = false;
                break;

            default:
                params.base64 = parseInt( args.base64, 10 );
                break;
        }

    }


    // resolve error reporting preferences

    var hasErrorsPrefs = ( args.errors || args[ 'errors-includes' ] || args[ 'errors-resources' ] || args[ 'errors-processors' ] );

    if ( hasErrorsPrefs ) {

        params.errors = {};

    }

    if ( args[ 'errors-includes' ] ) {

        params.errors.includes = args[ 'errors-includes' ];

    }

    if ( args[ 'errors-resources' ] ) {

        params.errors.resources = args[ 'errors-resources' ];

    }

    if ( args[ 'errors-processors' ] ) {

        params.errors.processors = args[ 'errors-processors' ];

    }

    if ( args.errors ) {

        params.errors.includes   = args.errors;
        params.errors.resources  = args.errors;
        params.errors.processors = args.errors;

    }


    // returns params

    return params;

};

