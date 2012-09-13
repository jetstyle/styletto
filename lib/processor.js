"use strict";

exports.process = Processor;

function Processor ( data, ext, pathToFile ) {

    this.error = false;
    this.raw   = data;
    this.path  = pathToFile;

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

    var stylus = require( 'stylus' );
    var nib    = require( 'nib' );
    var error  = false;
    var result = false;

    stylus( this.raw )
        .set( 'filename', this.path )
        .import( 'nib' )
        .use( nib() )
        .render( function ( err, css ) {

        error = ( err ) ? err : false;

        result = ( css ) ? css : false;

    } );

    if ( error ) {

        this.error = error;

    }

    this.result = ( result ) ? result : this.raw;

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

    this.result = ( result ) ? result : this.raw;

};

var check = exports.check = function ( ext ) {

    return ['.css', '.styl', '.less'].indexOf( ext ) !== -1;

};
