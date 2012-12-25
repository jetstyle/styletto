"use strict";

var colors = require( 'colors' );

module.exports = ErrorCollector;

function ErrorCollector( config ) {

    this.collection = [];
    this.config     = config;
    this.criticalError = false;

}

ErrorCollector.prototype.parseError = function ( type, message ) {

    var currentErrorRule = this.config[ type ];

    if ( currentErrorRule === 'alert' ) {

        this.collection.push( new ParseError( currentErrorRule, message ) );

    } else if ( currentErrorRule === 'error' ) {

        this.collection.push( new ParseError( currentErrorRule, message ) );

        this.criticalError = true;

    }

};

ErrorCollector.prototype.report = function () {

    var report = '';

    if ( this.collection.length > 0 ) {

        for ( var i = 0; i < this.collection.length; i++ ) {

            report += this.collection[ i ].preview + '\n';

        }

        return report;

    }

    else {

        return false;

    }

};

function ParseError ( type, message ) {

    this.type    = type;
    this.message = ( message.message ) ? message.message : message;

    if ( this.type === 'alert' ) {

        this.isAlert();

    }

    else if ( type === 'error' ) {

        this.isError();

    }

}

ParseError.prototype.isAlert = function() {

    this.preview = 'Alert! '.yellow + this.message;

};

ParseError.prototype.isError = function() {

    this.preview = 'Error! '.red + this.message;

};
