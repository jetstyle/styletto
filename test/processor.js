"use strict";

var vows   = require( 'vows' ),
    assert = require( 'assert' ),
    fs     = require( 'fs' ),
    path   = require( 'path' ),

    Processor      = require( '../lib/processor' ).process,
    ErrorCollector = require( '../lib/errorcollector' ),

    processorSuite = vows.describe( 'Processor module tests' );


processorSuite.addBatch({

    'In processed .styl file with full nib support:': {

        topic: function () {

            var dataFile  = path.resolve( 'examples/b-stylus/b-stylus.styl' ),
                data      = fs.readFileSync( dataFile, 'utf-8' ),
                processed = new Processor( data, '.styl', dataFile, true );

            return processed;

        },

        'border-radius function is converted,': function ( data ) {

            assert.includes ( data.result, '-webkit-border-radius' );

        },

        'clearfix function is converted,': function ( data ) {

            assert.includes ( data.result, 'display: table' );

        },

    }

});

processorSuite.addBatch({

    'In processed .styl file with nib support setted to "vendor":': {

        topic: function () {

            var dataFile  = path.resolve( 'examples/b-stylus/b-stylus.styl' ),
                data      = fs.readFileSync( dataFile, 'utf-8' ),
                processed = new Processor( data, '.styl', dataFile, 'vendor' );

            return processed;

        },

        'border-radius function is converted,': function ( data ) {

            assert.includes ( data.result, '-webkit-border-radius' );

        },

        'clearfix function is removed,': function ( data ) {

            assert.isNull ( data.result.match(/display..table/) );

        },

    }

});

processorSuite.addBatch({

    'In processed .styl file with nib support disabled:': {

        topic: function () {

            var dataFile  = path.resolve( 'examples/b-stylus/b-stylus.styl' ),
                data      = fs.readFileSync( dataFile, 'utf-8' ),
                processed = new Processor( data, '.styl', dataFile, false );

            return processed;

        },

        'border-radius function is removed,': function ( data ) {

            assert.isNull ( data.result.match(/-webkit-border-radius/) );

        },

        'clearfix function is removed,': function ( data ) {

            assert.isNull ( data.result.match(/display..table/) );

        },

    }

});
processorSuite.addBatch({

    'In processed .styl file with error:': {

        topic: function () {

            var dataFile  = path.resolve( 'examples/b-stylus/b-stylus-err.styl' ),
                data      = fs.readFileSync( dataFile, 'utf-8' ),
                processed = new Processor( data, '.styl', dataFile );

            return processed;

        },

        'we receive error on exit.': function ( data ) {

            assert.instanceOf( data.error, Error );

        },


    }

});

processorSuite.addBatch({

    'In processed .less file:': {

        topic: function () {

            var dataFile  = path.resolve( 'examples/b-less/b-less.less' ),
                data      = fs.readFileSync( dataFile, 'utf-8' ),
                processed = new Processor( data, '.less', dataFile );

            return processed;

        },

        'mixin is resolved.': function ( data ) {

            assert.includes ( data.result, '-moz-box-shadow: 0 0 5px rgba' );

        },


    }

});

processorSuite.addBatch({

    'In processed .less file with error:': {

        topic: function () {

            var dataFile  = path.resolve( 'examples/b-less/b-less-err.less' ),
                data      = fs.readFileSync( dataFile, 'utf-8' ),
                processed = new Processor( data, '.less', dataFile );

            return processed;

        },

        'we receive error on exit.': function ( data ) {

            assert.instanceOf( data.error, Object );

        },


    }

});

processorSuite.addBatch({

    'In processed .css file:': {

        topic: function () {

            var dataFile  = path.resolve( 'examples/all.css' ),
                data      = fs.readFileSync( dataFile, 'utf-8' ),
                processed = new Processor( data, '.css', dataFile );

            return processed;

        },

        'input and output are equal.': function ( data ) {

            assert.equal ( data.result, data.raw );

        },


    }

});

exports.processorSuite = processorSuite;
