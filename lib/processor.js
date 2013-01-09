"use strict";

var path = require( 'path' );

exports.process = Processor;

function Processor ( data, ext, pathToFile, configStylus ) {

    this.error = false;
    this.ext   = ext;
    this.raw   = data;
    this.path  = pathToFile;
    this.styl  = configStylus;

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

        if ( that.styl.mixins ) {

            for ( var i = 0; i < that.styl.mixins.length; i++ ) {

                style.import( that.styl.mixins[ i ] );

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
        that = this;

    new(less.Parser)( {
        paths: [ path.dirname( that.path ) ],
        filename: path.basename( that.path )
    } ).parse( that.raw, function ( err, tree ) {

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
