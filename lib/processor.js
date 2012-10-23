"use strict";

exports.process = Processor;

function Processor ( data, ext, pathToFile, configNib ) {

    this.error = false;
    this.raw   = data;
    this.path  = pathToFile;
    this.nib   = configNib;

    switch ( ext ) {

        case '.styl':

            this.type = 'stylus';
            this.parseStylus();
            break;

        case '.less':

            this.type = 'less';
            this.parseLess();
            break;

        default:

            this.type = 'css';
            this.result = this.raw;
            break;

    }

}

Processor.prototype.parseStylus = function () {

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

};

Processor.prototype.parseLess = function () {

    var less   = require( 'less' );
    var error  = false;
    var result = false;

    less.render( this.raw, function ( err, css ) {

        error = ( err ) ? err : false;

        result = ( css ) ? css : false;

    } );

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

};

var check = exports.check = function ( ext ) {

    return ['.css', '.styl', '.less'].indexOf( ext ) !== -1;

};
