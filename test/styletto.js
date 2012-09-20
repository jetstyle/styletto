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
            },
            result = NaN;

            styletto( config, function( err, success, css ) {

                result = ( !err && success && !css ) ? true : false;

            } );

            return result;

        },

        'file writed.': function ( data ) {

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
            },
            result = NaN;

            styletto( config, function( err, success, css ) {

                result = ( !err && success && css ) ? css : false;

            } );

            return result;

        },

        'output returned.': function ( data ) {

            assert.includes ( data, '@font-face' );

        },

    }

} );

exports.stylettoSuite = stylettoSuite;
