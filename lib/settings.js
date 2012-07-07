var path = require('path');
var fs   = require('fs');

module.exports = function ( arguments ) {

    var params = [];
    var global = { config: false };


    // filter command line arguments

    if ( arguments['compress'] ) {

        global.compress = arguments['compress'];

    }

    if ( arguments['base64'] ) {

        switch ( arguments['base64'] ) {

            case true:
                // fall through
            case 'true':
                global.base64 = true;
                break;

            case false:
                // fall through
            case 'false':
                global.base64 = false;
                break;

            default:
                global.base64 = parseInt( arguments['base64'], 10 );
                break;
        }
    }

    for ( var i = 0; i < arguments['_'].length; i++ ) {

        var stylePath       = /\.css|\.styl|\.less/.test( arguments['_'][i] );
        var configPath      = /\.json/.test(arguments['_'][i]);
        var inputUndefined  = ( global.input === undefined );

        if (configPath) {

            global.config = path.join( process.cwd(), arguments['_'][i] );

        }

        if (stylePath && inputUndefined) {

            global.input = arguments['_'][i];

        }

        var notEqualsInput  = ( arguments['_'][i] !== global.input );

        if ( stylePath && notEqualsInput && global.input ) {

            global.output = arguments['_'][i];

        }

    }

    // normalizing results of returning error if no confing or css file is send

    if ( global.config ) {

        if ( fs.existsSync( global.config ) ) {

            var configDir  = path.dirname( global.config );

            var configFile = JSON.parse( fs.readFileSync( global.config ) );

            // merging config and global flags

            configFile.compress = ( global.compress !== undefined ) ? global.compress : configFile.compress;
            configFile.base64   = ( global.base64 !== undefined ) ? global.base64 : configFile.base64;

            params = [configFile, configDir];

        }

        else {

            return new Error( 'Config file not found at provided path.' );

        }


    } else if (global.input) {

        params = [global, process.cwd()];

    } else return new Error( 'You need to send config or style file.' );

    // returns params or error

    delete params[0].config;

    return params;

}
