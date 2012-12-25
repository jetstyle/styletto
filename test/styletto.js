"use strict";

var vows   = require( 'vows' ),
    assert = require( 'assert' ),
    fs     = require( 'fs' ),
    path   = require( 'path' ),

    styletto = require( '../lib/styletto' ),

    stylettoSuite = vows.describe( 'Styletto module tests' );

stylettoSuite.addBatch( {

    'Testing writing mode:': {

        topic: function () {

            var config = {
                base64: false,
                compress: false,
                errors: 'ignore',
                path: 'examples',
                input: 'all.css',
                output: '_all.css'
            };

            styletto( config, this.callback );

        },

        'file writed.': function ( err, result ) {

            var data = ( !err && result.success && !result.data ) ? true : false;

            assert.isTrue ( data );

        },

    }

} );

stylettoSuite.addBatch( {

    'Testing prepareFile stdout mode function:': {

        topic: function () {

            var config = {
                base64: false,
                compress: false,
                errors: 'ignore',
                path: 'examples',
                input: 'all.css'
            };

            styletto( config, this.callback );

        },

        'output returned.': function ( err, result ) {

            var data = ( !err && result.success && result.data ) ? result.data : false;

            assert.includes ( data, '@font-face' );

        },

    }

} );

exports.stylettoSuite = stylettoSuite;
