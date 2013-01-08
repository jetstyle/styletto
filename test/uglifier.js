"use strict";

var vows   = require( 'vows' ),
    assert = require( 'assert' ),
    fs     = require( 'fs' ),
    path   = require( 'path' ),

    Uglifier       = require( '../lib/uglifier' ),
    ErrorCollector = require( '../lib/errorcollector' ),

    resolvePath    = path.resolve( 'examples/b-resources' ),

    uglifierSuite  = vows.describe( 'Uglifier module tests' ),

    BASE64_SIZE = '10000',

    BASE64_TYPES = {
        'gif':  'image/gif',
        'png':  'image/png',
        'jpg':  'image/jpeg',
        'jpeg': 'image/jpeg',
        'svg':  'image/svg+xml'
    },

    BASE64_TYPES_TEST = {
        'png':  'image/png',
        'woff': 'application/font-woff'
    };

uglifierSuite.addBatch( {

    'Testing compress: "csso" mode function:': {

        topic: function () {

            var params     = { compress: 'csso', base64: false },
                dataFile   = path.resolve( 'examples/b-compressors/b-compressors.css' ),
                data       = fs.readFileSync( dataFile, 'utf-8' ),
                collection = new ErrorCollector( { resources: 'ignore' } ),
                uglifier   = new Uglifier( data, params, collection );

            uglifier.uglify( function( newData, newCollection ) {

                data = newData;

                collection = newCollection;

            } );

            return data;

        },

        'file compressed.': function ( data ) {

            assert.includes ( data, 'padding:0' );

        },


    }

} );


uglifierSuite.addBatch( {

    'Testing compress "yui" mode function:': {

        topic: function () {

            var params     = { compress: 'yui', base64: false },
                dataFile   = path.resolve( 'examples/b-compressors/b-compressors.css' ),
                data       = fs.readFileSync( dataFile, 'utf-8' ),
                collection = new ErrorCollector( { resources: 'ignore' } ),
                uglifier   = new Uglifier( data, params, collection );

            uglifier.uglify( function( newData, newCollection ) {

                data = newData;

                collection = newCollection;

            } );

            return data;

        },

        'file compressed.': function ( data ) {

            assert.includes ( data, 'padding-left:0;padding-right:0;' );

        },

    }

});

uglifierSuite.addBatch( {

    'Testing base64 compression function:': {

        topic: function () {

            var params     = { compress: false, base64: { limit: 10000, types: BASE64_TYPES }, resolvePath: resolvePath },
                dataFile   = path.resolve( 'examples/b-resources/b-resources.css' ),
                data       = fs.readFileSync( dataFile, 'utf-8' ),
                collection = new ErrorCollector( { resources: 'ignore' } ),
                uglifier   = new Uglifier( data, params, collection );

            uglifier.uglify( function( newData, newCollection ) {

                data = newData;

                collection = newCollection;

            } );

            return data;

        },

        'gif replaced,': function ( data ) {

            assert.includes ( data, 'url("data:image/gif;base64,' );

        },

        'png replaced,': function ( data ) {

            assert.includes ( data, 'url("data:image/png;base64,' );

        },

        'jpeg replaced,': function ( data ) {

            assert.includes ( data, 'url("data:image/jpeg;base64,' );

        },

        'svg replaced.': function ( data ) {

            assert.includes ( data, 'url("data:image/svg+xml;base64,' );

        },

    }

} );

uglifierSuite.addBatch( {

    'Testing base64 compression function with only png and woff:': {

        topic: function () {

            var params     = { compress: false, base64: { limit: 30000, types: BASE64_TYPES_TEST }, resolvePath: resolvePath },
                dataFile   = path.resolve( 'examples/b-resources/b-resources.css' ),
                data       = fs.readFileSync( dataFile, 'utf-8' ),
                collection = new ErrorCollector( { resources: 'ignore' } ),
                uglifier   = new Uglifier( data, params, collection );

            uglifier.uglify( function( newData, newCollection ) {

                data = newData;

                collection = newCollection;

            } );

            return data;

        },

        'gif NOT replaced,': function ( data ) {

            assert.includes ( data, 'url("b-resources.gif")' );

        },

        'png replaced,': function ( data ) {

            assert.includes ( data, 'url("data:image/png;base64,' );

        },

        'jpeg NOT replaced,': function ( data ) {

            assert.includes ( data, "url('b-resources.jpeg');" );

        },

        'woff replaced.': function ( data ) {

            assert.includes ( data, 'url("data:application/font-woff;base64,' );

        },

    }

} );

uglifierSuite.addBatch( {

    'Testing base64Replace function size limit:': {

        topic: function () {

            var params     = { compress: false, base64: { limit: 100, types: BASE64_TYPES }, resolvePath: resolvePath },
                dataFile   = path.resolve( 'examples/b-resources/b-resources.css' ),
                data       = fs.readFileSync( dataFile, 'utf-8' ),
                collection = new ErrorCollector( { resources: 'ignore' } ),
                uglifier   = new Uglifier( data, params, collection );

            uglifier.uglify( function( newData, newCollection ) {

                data = newData;

                collection = newCollection;

            } );

            return data;

        },

        'jpeg NOT replaced.': function ( data ) {

            assert.includes ( data, 'url(\'b-resources.jpeg\');' );

        },


    }

} );

uglifierSuite.addBatch( {

    'errors.resources setted to "error" and wrong image url returned:': {

        topic: function () {

            var params     = { compress: false, base64: { limit: 100, types: BASE64_TYPES }, resolvePath: resolvePath },
                dataFile   = path.resolve( 'examples/b-resources/b-resources.css' ),
                data       = fs.readFileSync( dataFile, 'utf-8' ),
                collection = new ErrorCollector( { resources: 'error' } ),
                uglifier   = new Uglifier( data, params, collection );

            uglifier.uglify( function( newData, newCollection ) {

                data = newData;

                collection = newCollection;

            } );

            return collection;

        },

        'critical arror.': function ( data ) {

            assert.isTrue( data.criticalError );

        },


    }

} );

exports.uglifierSuite = uglifierSuite;
