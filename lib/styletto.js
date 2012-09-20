"use strict";

// dependencies

var fs = require( 'fs' ),
    util = require( 'util' ),
    path = require( 'path' ),

    normalize = require( './normalize' ),

    Parser = require( './parser' ),
    ErrorCollector = require( './errorcollector' ),
    Uglifier = require( './uglifier' );

var init = exports.init = function( config, callback ) {

    var data,
        resolvePath,
        params = normalize( config );

    if ( params instanceof Error ) {

        var ERROR_REGEX = /Error:(\s)*/;

        callback( params.toString().replace( ERROR_REGEX, ''), false, false );

    }

    // starting import search function

    var collection = new ErrorCollector( params.errors ),
        parser     = new Parser( params, collection );

    parser.parse( function ( resultCollection, resultData ) {

        collection = resultCollection;

        data = resultData;

    } );

    if ( collection.criticalError ) {

        return callback( collection.report(), false, false );

    }

    var uglifier = new Uglifier( data, params, collection );

    uglifier.uglify( function( newData, newCollection ) {

        data = newData;

        collection = newCollection;

    } );

    if ( collection.criticalError ) {

        return callback( collection.report(), false, false );

    }

    if ( params.output ) {

        fs.writeFileSync( params.output, data );

        data = NaN;

    }

    return callback( collection.report(), true, data );

};
