"use strict";

var path = require( 'path' );

exports.process = Processor;

function Processor ( data, ext, pathToFile, configNib ) {

    this.error = false;
    this.ext   = ext;
    this.raw   = data;
    this.path  = pathToFile;
    this.nib   = configNib;

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
        result = false;

    if ( this.nib === false ) {

        stylus( this.raw )
        .set( 'filename', this.path )
        .render( function ( err, css ) {

            error = ( err ) ? err : false;

            result = ( css ) ? css : false;

        } );

    }

    else {

        var nib = require( 'nib' );

        if ( this.nib === 'vendor' ) {

            stylus( this.raw )
            .set( 'filename', this.path )
            .use( nib() )
            .import( 'nib/config' )
            .import( 'nib/vendor' )
            .render( function ( err, css ) {

                error = ( err ) ? err : false;

                result = ( css ) ? css : false;

            } );

        }

        else {

            stylus( this.raw )
            .set( 'filename', this.path )
            .use( nib() )
            .import( 'nib' )
            .render( function ( err, css ) {

                error = ( err ) ? err : false;

                result = ( css ) ? css : false;

            } );

        }

    }

    if ( error ) {

        this.error = error;

    }

    if ( result ) {

        this.result = result;

    }

    else if ( !result && !error ) {

        this.result = '';

    }

    else {

        this.result = this.raw;

    }

    callback( this.error, this.result );

};

Processor.prototype.parseLess = function ( callback ) {

    var less = require( 'less' ),
        css;

    new(less.Parser)( {
        paths: [ path.dirname( this.path ) ],
        filename: path.basename( this.path )
    } ).parse( this.raw, function ( err, tree ) {

        if ( err ) {

            err = less.formatError( err );

            css = this.raw;

        }

        else {

            try {

                css = tree.toCSS();

            }

            catch ( e ) {

                err = less.formatError( e );

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
