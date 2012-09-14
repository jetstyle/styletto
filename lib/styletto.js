"use strict";

// dependencies

var fs = require( 'fs' );
var util = require( 'util' );
var path = require( 'path' );
var normalize = require( './normalize' );
var Parser = require( './parser' );
var ErrorCollector = require( './errorcollector' );
var Uglifier = require( './uglifier' );

var init = exports.init = function( config, callback ) {

    var data;
    var resolvePath;

    var params = normalize( config );

    if ( params instanceof Error ) {

        callback( params, false, false );

    }

    // starting import search function

    if ( params.output ) {

        var outputPath = path.join( params.path, params.output );

        params.resolvePath = path.dirname( outputPath );

    } else {

        params.resolvePath = params.path;

    }

    var collection = new ErrorCollector( config.errors );
    var parser     = new Parser( params, collection );

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

var prepareFile = exports.prepareFile = function( data, params ) {


    if ( params.output ) {

        fs.writeFileSync( params.output, data );

        return NaN;

    } else {

        return data;

    }

};

