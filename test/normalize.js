"use strict";

var vows   = require( 'vows' ),
    assert = require( 'assert' ),
    fs     = require( 'fs' ),
    path   = require( 'path' ),

    normalize = require( '../lib/normalize' ),

    pathToConfig = path.resolve( 'examples' ),
    normalizeSuite = vows.describe( 'Normalize module tests' );


normalizeSuite.addBatch( {

    'Sending full config with array returns:': {

        topic: function () {

            var config = {
                'input': [ 'b-includes/_two/b-includes_two.css', 'b-includes/_three/b-includes_three.css' ],
                'output': '_all.css',
                'compress': true,
                'base64': true,
                'nib': 'vendor',
                'errors': 'ignore',
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

            assert.isTrue ( params.exists );

        },

        'compress is set to CSSO,': function ( params ) {

            assert.equal ( params.compress, 'csso' );

        },

        'base64 encode size is set to 10000,': function ( params ) {

            assert.equal ( params.base64, 10000 );

        },

        'nib mixins is set to "vendor",': function ( params ) {

            assert.equal ( params.nib, 'vendor' );

        },

        'all error types are set to "ignore",': function ( params ) {

            var imports    = ( params.errors.imports === 'ignore' ),
                resources  = ( params.errors.resources === 'ignore' ),
                processors = ( params.errors.processors === 'ignore' );

            assert.isTrue ( resources && imports && processors );

        },

        'resolvePath is equal to output path.': function ( params ) {

            assert.equal ( path.dirname( params.output ), params.resolvePath );

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

    'Sending config with input, non-existing output, and false compress/base64/nib flags returns:': {

        topic: function () {

            var config = {
                'input': 'all.css',
                'output': 'non-existing.css',
                'compress': false,
                'base64': false,
                'nib': false,
                'path': pathToConfig
            };

            return normalize( config );

        },

        'input file exists,': function ( params ) {

            assert.isTrue( fs.existsSync( params.input[0] ) );

        },

        'output file provided,': function ( params ) {

            assert.isString( params.output );

        },

        'output file NOT exists,': function ( params ) {

            var isExists = ( fs.existsSync( params.output ) && params.exists );

            assert.isFalse( isExists );

        },

        'compress is NOT set,': function ( params ) {

            assert.isFalse ( params.compress );

        },

        'nib is NOT set,': function ( params ) {

            assert.isFalse ( params.nib );

        },

        'base64 encode is NOT set.': function ( params ) {

            assert.isFalse ( params.base64 );

        },


    }

});

normalizeSuite.addBatch({

    'Sending config with normal input, compress: "yui", nib: "true" and base64: "1300" returns:': {

        topic: function () {

            var config = {
                'input': 'all.css',
                'compress': 'yui',
                'base64': 1300,
                'nib': true,
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

        'nib is set to "true",': function ( params ) {

            assert.isTrue ( params.nib );


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
                'input': 'examples/all.css',
                'errors': {
                    'imports': 'error',
                    'resources': 'alert',
                    'processors': 'ignore'
                },
                'path': process.cwd()
            };

            return normalize( config );

        },

        'resolvePath is current dir,': function ( params ) {

            assert.equal ( params.resolvePath, process.cwd() );

        },

        'errors.imports value is "error",': function ( params ) {

            assert.equal ( params.errors.imports, 'error' );

        },

        'errors.resources value is "alert",': function ( params ) {

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
