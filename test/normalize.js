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

            assert.equal ( params.base64.limit, 10000 );

        },

        'all error types are set to "ignore",': function ( params ) {

            var imports    = ( params.errors.imports === 'ignore' ),
                resources  = ( params.errors.resources === 'ignore' ),
                processors = ( params.errors.processors === 'ignore' );

            assert.isTrue ( resources && imports && processors );

        },

        'stylus.imports = false,': function ( params ) {

            assert.isFalse ( params.stylus.imports );

        },

        'stylus.variables = false,': function ( params ) {

            assert.isFalse ( params.stylus.variables );

        },

        'less.imports = false,': function ( params ) {

            assert.isFalse ( params.less.imports );

        },

        'less.variables = false,': function ( params ) {

            assert.isFalse ( params.less.variables );

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

            assert.isTrue ( fs.existsSync( params.input[0] ) );

        },

    }

});


normalizeSuite.addBatch({

    'Sending config with input, non-existing output, stylus import, stylus variable, less import, less variable and false compress/base64 flags returns:': {

        topic: function () {

            var config = {
                'input': 'all.css',
                'output': 'non-existing.css',
                'compress': false,
                'base64': false,
                'stylus': {
                    'imports': [ 'i-mixins/i-mixins__clearfix.styl' ],
                    'variables': { 'myname': 'Vasya' }
                },
                'less': {
                    'imports': [ 'i-mixins/i-mixins__lesshat.less' ],
                    'variables': { 'myname': 'Petya' }
                },
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

        'base64 encode is NOT set,': function ( params ) {

            assert.isFalse ( params.base64 );

        },

        'stylus.imports is set,': function ( params ) {

            assert.equal ( params.stylus.imports[ 0 ], path.join( process.cwd(), 'examples/i-mixins/i-mixins__clearfix.styl'  ) );


        },

        'stylus.variable is set.': function ( params ) {

            assert.equal ( params.stylus.variables.myname, 'Vasya' );

        },

        'less.imports is set,': function ( params ) {

            assert.equal ( params.less.imports[ 0 ], path.join( process.cwd(), 'examples/i-mixins/i-mixins__lesshat.less'  ) );


        },

        'less.variable is set.': function ( params ) {

            assert.equal ( params.less.variables.myname, 'Petya' );

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

            assert.isTrue ( fs.existsSync( params.input[0] ) );

        },

        'compress is set to "yui",': function ( params ) {

            assert.equal ( params.compress, 'yui' );

        },

        'base64 encode is set to "1300".': function ( params ) {

            assert.equal ( params.base64.limit, 1300 );

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

    'Sending config with src/dest instead of input/output returns:': {

        topic: function () {

            var config = {
                'src': 'all.css',
                'dest': '_all.css',
                'path': pathToConfig
            };

            return normalize( config );

        },

        'src changed to input,': function ( params ) {

            assert.equal ( params.input[ 0 ], path.resolve( process.cwd(), 'examples/all.css' ) );

        },

        'dest changed to output.': function ( params ) {

            assert.equal ( params.output, path.resolve( process.cwd(), 'examples/_all.css' ) );

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


normalizeSuite.addBatch( {

    'Sending config with base64.limit = 1300 and base64.types = { "png" : "image/png" } returns:': {

        topic: function () {

            var config = {
                'input': [ 'b-includes/_two/b-includes_two.css', 'b-includes/_three/b-includes_three.css' ],
                'output': '_all.css',
                'compress': true,
                'base64': {
                    'limit': 1300,
                    'types': {
                        'png': 'image/png'
                    }
                },
                'errors': 'ignore',
                'path': pathToConfig
            };

            return normalize( config );

        },

        'base64.limit = 1300,': function ( params ) {

            assert.isTrue ( params.base64.limit === 1300 );

        },

        'base64.types have only png.': function ( params ) {

            assert.equal ( params.base64.types.png, 'image/png' );

        }

    }

});

normalizeSuite.addBatch( {

    'Sending config with base64.types = "abracadabra" returns:': {

        topic: function () {

            var config = {
                'input': [ 'b-includes/_two/b-includes_two.css', 'b-includes/_three/b-includes_three.css' ],
                'output': '_all.css',
                'compress': true,
                'base64': {
                    'limit': 1300,
                    'types': 'abrecadabra'
                },
                'errors': 'ignore',
                'path': pathToConfig
            };

            return normalize( config );

        },

        'error.': function ( params ) {

            assert.instanceOf ( params, Error );

        },

    }

});

normalizeSuite.addBatch( {

    'Sending config with base64.limit = "abracadabra" returns:': {

        topic: function () {

            var config = {
                'input': [ 'b-includes/_two/b-includes_two.css', 'b-includes/_three/b-includes_three.css' ],
                'output': '_all.css',
                'compress': true,
                'base64': {
                    'limit': 'abrecadabra',
                    'types': {
                        'png': 'image/png'
                    }
                },
                'errors': 'ignore',
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
