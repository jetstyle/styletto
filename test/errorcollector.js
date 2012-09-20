"use strict";

var vows   = require( 'vows' ),
    assert = require( 'assert' ),
    fs     = require( 'fs' ),
    path   = require( 'path' ),

    ErrorCollector = require( '../lib/errorcollector' ),

    processorSuite = vows.describe( 'ErrorCollector module tests' );

processorSuite.addBatch({

    'Sending error for resources while resources is set to "error" results:': {

        topic: function () {

            var collection = new ErrorCollector( { resources: 'error' } );

            collection.parseError( 'resources', 'Not good' );

            return collection;

        },

        'error is in the errors array,': function ( data ) {

            assert.equal ( data.collection.length, 1 );

        },

        'critial error flag is set to "true",': function ( data ) {

            assert.isTrue ( data.criticalError );

        },

        'report returns string with error texts.': function ( data ) {

            assert.includes ( data.report(), 'Error!' );

        },

    }

});

processorSuite.addBatch({

    'Sending error for resources while resources is set to "alert" results:': {

        topic: function () {

            var collection = new ErrorCollector( { resources: 'alert' } );

            collection.parseError( 'resources', 'Not good' );

            return collection;

        },

        'error is in the errors array,': function ( data ) {

            assert.equal ( data.collection.length, 1 );

        },

        'critial error flag is set to "false",': function ( data ) {

            assert.isFalse ( data.criticalError );

        },

        'report returns string with error texts.': function ( data ) {

            assert.includes ( data.report(), 'Alert!' );

        },

    }

});

processorSuite.addBatch({

    'Sending error for resources while resources is set to "ignore" results:': {

        topic: function () {

            var collection = new ErrorCollector( { resources: 'ignore' } );

            collection.parseError( 'resources', 'Not good' );

            return collection;

        },

        'error is NOT in the errors array,': function ( data ) {

            assert.equal ( data.collection.length, 0 );

        },

        'critial error flag is set to "false",': function ( data ) {

            assert.isFalse ( data.criticalError );

        },

        'report returns false.': function ( data ) {

            assert.isFalse ( data.report() );

        },

    }

});
exports.processorSuite = processorSuite;
