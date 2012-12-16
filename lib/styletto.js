"use strict";

// dependencies

var fs = require( 'fs' ),
    util = require( 'util' ),
    path = require( 'path' ),

    normalize = require( './normalize' ),

    Parser = require( './parser' ),
    ErrorCollector = require( './errorcollector' ),
    Uglifier = require( './uglifier' );

module.exports = function( config, callback ) {

    var resolvePath,
        params;

    try {

        params = normalize( config );

    }

    catch ( e ) {

        callback( e, false, false );

    }

    // starting import search function

    var collection = new ErrorCollector( params.errors ),
        parser     = new Parser( params, collection );

    parser.parse( function ( collection, data ) {

        if ( collection.criticalerror ) {

            callback( collection.report(), false, false );

            return;

        }

        new Uglifier( data, params, collection ).uglify( function( newData, newCollection ) {

            data = newData;

            collection = newCollection;

        } );

        if ( collection.criticalError ) {

            callback( collection.report(), false, false );

            return;

        }

        if ( params.output ) {

            fs.writeFileSync( params.output, data );

            data = NaN;

        }

        callback( collection.report(), true, data );

        return;

    } );

};
