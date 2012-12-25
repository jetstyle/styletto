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

        callback( e.message, { success: false, data: false } );

    }

    // starting import search function

    var collection = new ErrorCollector( params.errors ),
        parser     = new Parser( params, collection );

    parser.parse( function ( err, result ) {

        var collection = result.collection;

        var data = result.data;

        if ( collection.criticalError ) {

            callback( collection.report(), { success: false, data: false } );

            return;

        }

        new Uglifier( data, params, collection ).uglify( function( newData, newCollection ) {

            data = newData;

            collection = newCollection;

        } );

        if ( collection.criticalError ) {

            callback( collection.report(), { success: false, data: false } );

            return;

        }

        if ( params.output ) {

            fs.writeFileSync( params.output, data );

            data = NaN;

        }

        callback( collection.report(), { success: true, data: data } );

        return;

    } );

};
