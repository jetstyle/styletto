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
                processor = new Processor( data, '.styl', dataFile, true );

            processor.parse( this.callback );

        },

        'border-radius function is converted,': function ( err, data ) {

            assert.includes ( data, '-webkit-border-radius' );

        },

        'clearfix function is converted,': function ( err, data ) {

            assert.includes ( data, 'display: table' );

        },

    }

});

processorSuite.addBatch({

    'In processed .styl file with nib support setted to "vendor":': {

        topic: function () {

            var dataFile  = path.resolve( 'examples/b-stylus/b-stylus.styl' ),
                data      = fs.readFileSync( dataFile, 'utf-8' ),
                processor = new Processor( data, '.styl', dataFile, 'vendor' );

            processor.parse( this.callback );

        },

        'border-radius function is converted,': function ( err, data ) {

            assert.includes ( data, '-webkit-border-radius' );

        },

        'clearfix function is removed,': function ( err, data ) {

            assert.isNull ( data.match(/display..table/) );

        },

    }

});

processorSuite.addBatch({

    'In processed .styl file with nib support disabled:': {

        topic: function () {

            var dataFile  = path.resolve( 'examples/b-stylus/b-stylus.styl' ),
                data      = fs.readFileSync( dataFile, 'utf-8' ),
                processor = new Processor( data, '.styl', dataFile, false );

            processor.parse( this.callback );

        },

        'border-radius function is removed,': function ( err, data ) {

            assert.isNull ( data.match(/-webkit-border-radius/) );

        },

        'clearfix function is removed,': function ( err, data ) {

            assert.isNull ( data.match(/display..table/) );

        },

    }

});
processorSuite.addBatch({

    'In processed .styl file with error:': {

        topic: function () {

            var dataFile  = path.resolve( 'examples/b-stylus/b-stylus-err.styl' ),
                data      = fs.readFileSync( dataFile, 'utf-8' ),
                processor = new Processor( data, '.styl', dataFile );

            processor.parse( this.callback );

        },

        'we receive error on exit.': function ( err, data ) {

            assert.instanceOf( err, Error );

        },


    }

});

processorSuite.addBatch({

    'In processed .less file:': {

        topic: function () {

            var dataFile  = path.resolve( 'examples/b-less/b-less.less' ),
                data      = fs.readFileSync( dataFile, 'utf-8' ),
                processor = new Processor( data, '.less', dataFile );

            processor.parse( this.callback );

        },

        'mixin is resolved.': function ( err, data ) {

            assert.includes ( data, '-moz-box-shadow: 0 0 5px rgba' );

        },


    }

});

processorSuite.addBatch({

    'In processed .less file with error:': {

        topic: function () {

            var dataFile  = path.resolve( 'examples/b-less/b-less-err.less' ),
                data      = fs.readFileSync( dataFile, 'utf-8' ),
                processor = new Processor( data, '.less', dataFile );

            processor.parse( this.callback );

        },

        'we receive error on exit.': function ( err, data ) {

            assert.instanceOf( err, Error );

        },


    }

});

processorSuite.addBatch({

    'In processed .css file:': {

        topic: function () {

            var dataFile  = path.resolve( 'examples/all.css' ),
                data      = fs.readFileSync( dataFile, 'utf-8' ),
                processor = new Processor( data, '.css', dataFile );

            processor.parse( this.callback );

        },

        'input and output are equal.': function ( data ) {

            assert.equal ( data.result, data.raw );

        },


    }

});

exports.processorSuite = processorSuite;
