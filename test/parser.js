"use strict";

var vows   = require( 'vows' ),
    assert = require( 'assert' ),
    fs     = require( 'fs' ),
    path   = require( 'path' ),

    Parser = require( '../lib/parser' ),
    ErrorCollector = require( '../lib/errorcollector' ),

    resourcesTextSuite = fs.readFileSync( 'examples/b-resources/b-resources.css', 'utf-8' ),

    importsTextSuite = fs.readFileSync( 'examples/includes-search.css', 'utf-8' ),

    parserSuite = vows.describe( 'Parser module tests' );


parserSuite.addBatch( {

    'Calling function init with two inputs returns:': {

        topic: function () {

            var params = {
                    input: [
                        path.resolve( 'examples/b-includes/b-includes.css' ),
                        path.resolve( 'examples/b-resources/b-resources.css' )
                    ],
                    resolvePath: path.resolve( 'examples/' ),
                    errors: {
                        imports: 'error'
                    },
                    stylus: {
                        mixins: false,
                        variables: false
                    },
                    less: {
                        mixins: false,
                        variables: false
                    }
                },
                collection = new ErrorCollector( params.errors ),
                parser     = new Parser( params, collection ),
                data;

            parser.parse( this.callback );

        },

        'first input file added,': function ( err, result ) {

            assert.include ( result.data, '.b-includes {}' );

        },

        'second input file added.': function ( err, result ) {

            assert.include ( result.data, '.b-resources {}' );

        },

    }

} );

parserSuite.addBatch( {

    'Calling function importsReplace with examples/all.css returns:': {

        topic: function () {

            var params = {
                    input: [
                        path.resolve( 'examples/b-includes/b-includes.css' ),
                        path.resolve( 'examples/b-resources/b-resources.css' )
                    ],
                    resolvePath: path.resolve( 'examples/' ),
                    errors: {
                        imports: 'error'
                    },
                    stylus: {
                        mixins: false,
                        variables: false
                    },
                    less: {
                        mixins: false,
                        variables: false
                    }
                },
                collection = new ErrorCollector( params.errors ),
                parser     = new Parser( params, collection ),
                result,
                info = {
                    baseDir: params.resolvePath,
                    importFile: undefined,
                    relativePath: 'all.css',
                    mediaQuery: '',
                    that: parser
                };

            parser.importsReplace( info, this.callback );

        },

        'CSS comments are deleted,': function ( err, data ) {

            assert.isFalse( /\/\*@import "commented-url-must-be-deleted.css";*\//.test( data.compiled ) );

        },

        '.styl files are replaced,': function ( err, data ) {

            assert.include( data.compiled, '.b-stylus {' );

        },

        'imports are inserted,': function ( err, data ) {

            assert.include( data.compiled, '.b-includes_tree {}' );

        },

        'resources are resolved.': function ( err, data ) {

            assert.include( data.compiled, 'url("b-resources/b-resources.png")' );

        },

    }

} );


parserSuite.addBatch( {

    'Calling function importsReplace with wrong path to input returns:': {

        topic: function () {

            var params = {
                    input: [
                        path.resolve( 'examples/b-includes/b-includes.css' ),
                        path.resolve( 'examples/b-resources/b-resources.css' )
                    ],
                    resolvePath: path.resolve( 'examples/' ),
                    errors: {
                        imports: 'error'
                    },
                    stylus: {
                        mixins: false,
                        variables: false
                    },
                    less: {
                        mixins: false,
                        variables: false
                    }
                },
                collection = new ErrorCollector( params.errors ),
                parser     = new Parser( params, collection ),
                data,
                info = {
                    baseDir: params.resolvePath,
                    importFile: undefined,
                    relativePath: 'alsdfssdfl.css',
                    mediaQuery: '',
                    that: parser
                };

                parser.importsReplace( info, this.callback );

        },

        'error.': function ( err, data ) {

            assert.isFalse ( data );

        },

    }

} );

parserSuite.addBatch( {

    'Calling function importsSearch with examples/all.css returns:': {

        topic: function () {

            var params = {
                    input: [
                        path.resolve( 'examples/b-includes/b-includes.css' ),
                        path.resolve( 'examples/b-resources/b-resources.css' )
                    ],
                    resolvePath: path.resolve( 'examples/' ),
                    errors: {
                        imports: 'error'
                    },
                    stylus: {
                        mixins: false,
                        variables: false
                    },
                    less: {
                        mixins: false,
                        variables: false
                    }
                },
                collection = new ErrorCollector( params.errors ),
                parser     = new Parser( params, collection ),
                data;

            parser.importsSearch( importsTextSuite, 'examples/', 'examples/includes-search.css', parser, this.callback );

        },

        '"http://some.ru/external.css" are ignored,': function ( err, data ) {                   assert.include ( data, ' "http://some.ru/external.css"' ); },
        '"https://some.secure.ru/external.css" are ignored,': function ( err, data ) {           assert.include ( data, ' "https://some.secure.ru/external.css"' ); },
        '"/absolute.url.must.not.resolve.css" are ignored,': function ( err, data ) {            assert.include ( data, ' "/absolute.url.must.not.resolve.css"' ); },
        '\'http://some.ru/external.css\' are ignored,': function ( err, data ) {                 assert.include ( data, ' \'http://some.ru/external.css\'' ); },
        '\'https://some.secure.ru/external.css\' are ignored,': function ( err, data ) {         assert.include ( data, ' \'https://some.secure.ru/external.css\'' ); },
        '\'/absolute.url.must.not.resolve.css\' are ignored,': function ( err, data ) {          assert.include ( data, ' \'/absolute.url.must.not.resolve.css\'' ); },
        'url("http://some.ru/external.css") are ignored,': function ( err, data ) {              assert.include ( data, 'url("http://some.ru/external.css")' ); },
        'url("https://some.secure.ru/external.css") are ignored,': function ( err, data ) {      assert.include ( data, 'url("https://some.secure.ru/external.css")' ); },
        'url("/absolute.url.must.not.resolve.css") are ignored,': function ( err, data ) {       assert.include ( data, 'url("/absolute.url.must.not.resolve.css")' ); },
        'url(\'http://some.ru/external.css\') are ignored,': function ( err, data ) {            assert.include ( data, 'url(\'http://some.ru/external.css\')' ); },
        'url(\'https://some.secure.ru/external.css\') are ignored,': function ( err, data ) {    assert.include ( data, 'url(\'https://some.secure.ru/external.css\')' ); },
        'url(\'/absolute.url.must.not.resolve.css\') are ignored,': function ( err, data ) {     assert.include ( data, 'url(\'/absolute.url.must.not.resolve.css\')' ); },
        'url(http://some.ru/external.css) are ignored,': function ( err, data ) {                assert.include ( data, 'url(http://some.ru/external.css)' ); },
        'url(https://some.secure.ru/external.css) are ignored,': function ( err, data ) {        assert.include ( data, 'url(https://some.secure.ru/external.css)' ); },
        'url(/absolute.url.must.not.resolve.css) are ignored,': function ( err, data ) {         assert.include ( data, 'url(/absolute.url.must.not.resolve.css)' ); },
        '"b-includes/b-includes.css" are replaced,': function ( err, data ) {                    assert.include ( data, '.b-includes {}' ); },
        '\'_one/b-includes_one.css\' are replaced,': function ( err, data ) {                    assert.include ( data, '.b-includes_one {}' ); },
        'url(\'_two/b-includes_two.css\') are replaced,': function ( err, data ) {               assert.include ( data, '.b-includes_two {}' ); },
        'url(_three/b-includes_three.css) are replaced,': function ( err, data ) {               assert.include ( data, '.b-includes_tree {}' ); },
        'url("_four/b-includes_four.css") are replaced,': function ( err, data ) {               assert.include ( data, '.b-includes_four {}' ); },
        'url(\'../../b-resources/b-resources.css\') are replaced,': function ( err, data ) {     assert.include ( data, '.b-resources__png { background: url("b-resources/b-resources.png"); }' ); },
        'mediaquery "screen and (max-device-width: 480px)" are saved.': function ( err, data ) { assert.include ( data, '@media screen and (max-device-width: 480px)' ); },

    }

});

parserSuite.addBatch( {

    'Calling function resolvePaths on examples/b-resources/b-resources.css returns:': {

        topic: function () {

            var params = {
                    input: [
                        path.resolve( 'examples/b-includes/b-includes.css' ),
                        path.resolve( 'examples/b-resources/b-resources.css' )
                    ],
                    resolvePath: path.resolve( 'examples/' ),
                    errors: {
                        imports: 'error'
                    },
                    stylus: {
                        mixins: false,
                        variables: false
                    },
                    less: {
                        mixins: false,
                        variables: false
                    }
                },
                collection = new ErrorCollector( params.errors ),
                parser     = new Parser( params, collection ),
                data;

            return parser.resolvePaths(resourcesTextSuite, '../examples/b-resources/', '../examples/');

        },

        'woff path fixed,': function ( data ) { assert.include ( data, 'url("b-resources/b-resources.woff")' ); },
        'woff with params path fixed,': function ( data ) { assert.isTrue( data.indexOf( 'url("b-resources/b-resources.woff?#iefix&v=3.2.1")' ) >= 0 ); },
        'png path fixed,':  function ( data ) { assert.include ( data, 'url("b-resources/b-resources.png")' ); },
        'jpeg path fixed,': function ( data ) { assert.include ( data, 'url("b-resources/b-resources.jpeg")' ); },
        'jpg path fixed,':  function ( data ) { assert.include ( data, 'url("b-resources/b-resources.jpg")' ); },
        'gif path fixed,':  function ( data ) { assert.include ( data, 'url("b-resources/b-resources.gif")' ); },
        'svg path fixed,':  function ( data ) { assert.include ( data, 'url("b-resources/b-resources.svg")' ); },
        'web paths NOT fixed,': function ( data ) {

            var webOne = data.indexOf( '.b-resources__web-one { background: url("http://www.google.com/images/srpr/logo3w.png"); }' ) !== -1;
            var webTwo = data.indexOf( '.b-resources__web-two { background: url(http://www.google.com/images/srpr/logo3w.png); }' ) !== -1;
            var webThree = data.indexOf( '.b-resources__web-three { background: url(\'http://www.google.com/images/srpr/logo3w.png\'); }' ) !== -1;
            var allWebWorked = ( webOne && webTwo && webThree );
            assert.isTrue ( allWebWorked );

        },
        'absolute paths NOT fixed.': function ( data ) {

            var absoluteOne = data.indexOf( '.b-resources__absolute-one { background: url("/b-resources.png"); }' ) !== -1;
            var absoluteTwo = data.indexOf( '.b-resources__absolute-two { background: url(/b-resources.png); }' ) !== -1;
            var absoluteThree = data.indexOf( '.b-resources__absolute-three { background: url(\'/b-resources.png\'); }' ) !== -1;
            var allAbsoluteWorked = ( absoluteOne && absoluteTwo && absoluteThree );
            assert.isTrue ( allAbsoluteWorked );

        },

    }

} );

exports.parserSuite = parserSuite;
