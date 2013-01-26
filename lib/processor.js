"use strict";

var path = require( 'path' );

exports.process = Processor;

function Processor ( data, ext, pathToFile, config ) {

    this.error = false;
    this.ext   = ext;
    this.raw   = data;
    this.path  = pathToFile;
    this.styl  = config.stylus;
    this.less  = config.less;

}

Processor.prototype.parse = function ( callback ) {

    switch ( this.ext ) {

        case '.styl':

            this.type = 'stylus';
            this.parseStylus( callback );
            break;

        case '.less':

            this.type = 'less';
            this.parseLess( callback );
            break;

        default:

            this.type = 'css';
            callback( this.error, this.raw );
            break;

    }

};

Processor.prototype.parseStylus = function ( callback ) {

    var stylus = require( 'stylus' ),
        error  = false,
        result = false,
        that = this;

    var stylusConstructor = function ( style ) {

        style.set( 'filename', that.path );

        if ( that.styl.variables ) {

            for( var key in that.styl.variables ) {

                style.define( key, that.styl.variables[ key ] );

            }

        }

        if ( that.styl.imports ) {

            for ( var i = 0; i < that.styl.imports.length; i++ ) {

                style.import( that.styl.imports[ i ] );

            }

        }

    };

    stylus( that.raw ).use( stylusConstructor ).render( function ( err, css ) {

        error = ( err ) ? err : false;

        result = ( css ) ? css : that.raw;

        callback( error, result );

    } );


};

Processor.prototype.parseLess = function ( callback ) {

    var less = require( 'less' ),
        css,
        that = this,
        newVar = '',
        newImport = '',
        newRaw = that.raw,
        newPath = path.dirname( that.path );

    if ( that.less.variables ) {

        for( var key in that.less.variables ) {

            newVar = '@' + key + ': ' + that.less.variables[ key ] + ';\n';

            newRaw = newVar + newRaw;

        }

    }

    if ( that.less.imports ) {

        for ( var i = 0; i < that.less.imports.length; i++ ) {

            newImport = '@import "' + path.relative( newPath, that.less.imports[ i ] ) + '";\n';

            newRaw = newImport + newRaw;

        }

    }

    new(less.Parser)( {
        paths: [ newPath ],
        filename: path.basename( that.path )
    } ).parse( newRaw, function ( err, tree ) {

        if ( err ) {

            err = new Error ( less.formatError( err ) );

            css = that.raw;

        }

        else {

            try {

                css = tree.toCSS();

            }

            catch ( e ) {

                err = new Error ( less.formatError( e ) );

            }

            err = err || false;

            css = css || '';

        }

        return callback( err, css );

    } );

};

var check = exports.check = function ( ext ) {

    return ['.css', '.styl', '.less'].indexOf( ext ) !== -1;

};
