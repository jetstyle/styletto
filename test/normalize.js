"use strict";

var vows   = require( 'vows' );
var assert = require( 'assert' );
var fs     = require( 'fs' );
var path   = require( 'path' );

var normalize = require( '../lib/normalize' );

var normalizeSuite = vows.describe( 'Normalize module tests' );

var pathToConfig = path.resolve( 'examples' );

var testFive = {
};

var testSix = {
};


normalizeSuite.addBatch( {

    'Sending full config with array returns:': {

        topic: function () {

            var config = {
                'input': [ 'b-includes/_two/b-includes_two.css', 'b-includes/_three/b-includes_three.css' ],
                'output': '_all.css',
                'compress': true,
                'base64': true,
                'path': pathToConfig
            };

            return normalize( config );

        },

        'all input files exists,': function ( params ) {


            var err = false;

            for ( var i = 0; i < params.input.length; i++ ) {

                var notExists = ( fs.existsSync( params.input[ i ] ) !== true );

                if ( notExists ) {

                    err = true;

                }

            }

            assert.isFalse ( err );

        },

        'output file provided,': function ( params ) {

            assert.isString ( params.output );

        },

        'output file exists,': function ( params ) {

            var file = path.join( params.path, params.output );

            var isExists = ( fs.existsSync( file ) && params.exists );

            assert.isTrue ( isExists );

        },

        'compress is set to CSSO,': function ( params ) {

            assert.equal ( params.compress, 'csso' );

        },

        'base64 encode size is set to 10000.': function ( params ) {

            assert.equal ( params.base64, 10000 );

        },

    }

});

normalizeSuite.addBatch({

    'Sending config only with input returns:': {

        topic: function () {

            var config = {
                'input': 'all.css',
                'path': pathToConfig
            };

            return normalize( config );

        },

        'input file exists.': function ( params ) {

            var file = path.join( params.path, params.input );

            assert.isTrue ( fs.existsSync( file ) );

        },

    }

});


normalizeSuite.addBatch({

    'Sending config with input, non-existing output, and false compress/base64 flags returns:': {

        topic: function () {

            var config = {
                'input': 'all.css',
                'output': 'non-existing.css',
                'compress': false,
                'base64': false,
                'path': pathToConfig
            };

            return normalize( config );

        },

        'input file exists,': function ( params ) {

            var file = path.join( params.path, params.input );

            assert.isTrue ( fs.existsSync( file ) );

        },

        'output file provided,': function ( params ) {

            assert.isString ( params.output );

        },

        'output file NOT exists,': function ( params ) {

            var isExists = ( fs.existsSync( params.output ) && params.exists );

            assert.isFalse ( isExists );

        },

        'compress is NOT set,': function ( params ) {

            assert.isFalse ( params.compress );

        },

        'base64 encode is NOT set.': function ( params ) {

            assert.isFalse ( params.base64 );

        },


    }

});

normalizeSuite.addBatch({

    'Sending config with normal input, compress: "yui" and base64: "1300" returns:': {

        topic: function () {

            var config = {
                'input': 'all.css',
                'compress': 'yui',
                'base64': 1300,
                'path': pathToConfig
            };

            return normalize( config );

        },

        'input file exists,': function ( params ) {

            var file = path.join( params.path, params.input );

            assert.isTrue ( fs.existsSync( file ) );

        },

        'compress is set to "yui",': function ( params ) {

            assert.equal ( params.compress, 'yui' );

        },

        'base64 encode is set to "1300".': function ( params ) {

            assert.equal ( params.base64, 1300 );

        },

        'errors.imports value is "alert".': function ( params ) {

            assert.equal ( params.errors.imports, 'alert' );

        },

        'errors.resources value is "ignore".': function ( params ) {

            assert.equal ( params.errors.resources, 'ignore' );

        },

        'errors.processors value is "error".': function ( params ) {

            assert.equal ( params.errors.processors, 'error' );

        }

    }

});


normalizeSuite.addBatch( {

    'Sending config only with output returns:': {

        topic: function () {

            var config = {
                'output': '_all.css',
                'path': pathToConfig
            };

            return normalize( config );

        },

        'error.': function ( params ) {


            assert.instanceOf ( params, Error );

        },

    }

});

normalizeSuite.addBatch({

    'Sending config only with input returns:': {

        topic: function () {

            var config = {
                'input': 'all.css',
                'errors': {
                    'imports': 'error',
                    'resources': 'alert',
                    'processors': 'ignore'
                },
                'path': pathToConfig
            };

            return normalize( config );

        },

        'errors.imports value is "error".': function ( params ) {

            assert.equal ( params.errors.imports, 'error' );

        },

        'errors.resources value is "alert".': function ( params ) {

            assert.equal ( params.errors.resources, 'alert' );

        },

        'errors.processors value is "ignore".': function ( params ) {

            assert.equal ( params.errors.processors, 'ignore' );

        },

    }

});

normalizeSuite.addBatch({

    'Sending config with two wrong input urls returns:': {

        topic: function () {

            var config = {
                'input': [ 'b-comment/b--comment.css', 'b-foot/b--foot.css' ],
                'path': pathToConfig
            };

            return normalize( config );

        },

        'error.': function ( params ) {

            assert.instanceOf ( params, Error );

        },

    }

});

normalizeSuite.addBatch({

    'Sending wrong value for error returns:': {

        topic: function () {

            var config = {
                'input': 'all.css',
                'errors': {
                    'imports': 'gfg'
                },
                'path': pathToConfig
            };

            return normalize( config );

        },

        'error.': function ( params ) {

            assert.instanceOf ( params, Error );

        },

    }

});


exports.normalizeSuite = normalizeSuite;
