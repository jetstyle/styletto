var vows   = require('vows');
var assert = require('assert');
var fs     = require('fs');
var path   = require('path');

var styletto = require('../lib/styletto');

var stylettoSuite = vows.describe('Styletto module tests');

var testOne = {
    "output": "examples/_all.css",
    "compress": false,
    "base64": false
}

var testTwo = {
    "compress": 'yui',
    "base64": 200
}

var dataFile = fs.readFileSync('examples/b-resources/b-resources.css', 'utf-8');


stylettoSuite.addBatch({

    'Testing prepareFile write mode function:': {

        topic: function () {

            return styletto.prepareFile(dataFile, testOne, 'examples/');

        },

        'file writed.': function (data) { assert.isNaN (data) },
        
    }

});

stylettoSuite.addBatch({

    'Testing prepareFile stdout mode function:': {

        topic: function () {

            return styletto.prepareFile(dataFile, testTwo, 'examples/');

        },

        'output returned.': function (data) { assert.includes (data, '@font-face') },
        
    }

});

stylettoSuite.addBatch({

    'Testing compressReplace csso mode function:': {

        topic: function () {

            return styletto.compressReplace(dataFile, 'csso');

        },

        'file compressed.': function (data) { assert.includes (data, 'font-style:normal;font-weight:400;') },
        
    }

});

stylettoSuite.addBatch({

    'Testing compressReplace csso mode function:': {

        topic: function () {

            return styletto.compressReplace(dataFile, 'yui');

        },

        'file compressed.': function (data) { assert.includes (data, 'font-style:normal;font-weight:normal;') },
        
    }

});

stylettoSuite.addBatch({

    'Testing base64Replace function:': {

        topic: function () {

            return styletto.base64Replace(dataFile, 'examples/b-resources/', 500);

        },

        'gif replaced,': function (data) { assert.includes (data, 'url("data:image/gif;base64,') },
        'png replaced,': function (data) { assert.includes (data, 'url("data:image/png;base64,') },
        'jpeg replaced,': function (data) { assert.includes (data, 'url("data:image/jpeg;base64,') },
        'svg replaced.': function (data) { assert.includes (data, 'url("data:image/svg+xml;base64,') },
        
    }

});

stylettoSuite.addBatch({

    'Testing base64Replace function size limit:': {

        topic: function () {

            return styletto.base64Replace(dataFile, 'examples/b-resources/', 300);

        },

        'jpeg NOT replaced.': function (data) { assert.includes (data, 'url(\'b-resources.jpeg\');') },

        
    }

});

exports.stylettoSuite = stylettoSuite;