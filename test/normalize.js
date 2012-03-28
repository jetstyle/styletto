var vows   = require('vows');
var assert = require('assert');
var fs     = require('fs');
var path   = require('path');

var normalize = require('../lib/normalize');

var normalizeSuite = vows.describe('Normalize module tests');

var pathToConfig= path.resolve('examples');

console.log(pathToConfig);

var testOne = {
    "input": ["b-includes/_two/b-includes_two.css", "b-includes/_three/b-includes_three.css"],
    "output": "_all.css",
    "compile": true,
    "base64": true
}

var testTwo = {
    "input": "all.css"
}

var testThree = {
    "input": "all.css",
    "output": "non-existing.css",
    "compile": false,
    "base64": false
}


var testFour = {
    "output": "_all.css",
}

var testFive = {
    "input": ["b-comment/b--comment.css", "b-foot/b--foot.css"],
}


normalizeSuite.addBatch({

    'Sending full config with array returns:': {

        topic: function () {

            return normalize(testOne, pathToConfig);

        },

        'all input files exists,': function (params) {

            var err = false;

            for (var i = 0; i < params.input.length; i++) {

                var notExists = (path.existsSync(params.input[i]) !== true);

                if (notExists) err = true;

            }
            
            assert.isFalse (err);
        },
        'output file provided,': function (params) { assert.isString (params.output) },
        'output file exists,': function (params) { 

            var isExists = (path.existsSync(params.output) && params.exists);

            assert.isTrue (isExists);
        
        },
        'compile is set,': function (params) { assert.isTrue (params.compile); },
        'base64 encode is set.': function (params) { assert.isTrue (params.base64); },
        
    }

});

normalizeSuite.addBatch({

    'Sending config only with input returns:': {

        topic: function () {

            return normalize(testTwo, pathToConfig);

        },

        'input file exists.': function (params) { assert.isTrue (path.existsSync(params.input)); },

    }

});


normalizeSuite.addBatch({

    'Sending config with input, non-existing output, and false compile/base64 flags returns:': {

        topic: function () {

            return normalize(testThree, pathToConfig);

        },

        'input file exists,': function (params) { assert.isTrue (path.existsSync(params.input)); },
        'output file provided,': function (params) { assert.isString (params.output) },
        'output file NOT exists,': function (params) { 

            var isExists = (path.existsSync(params.output) && params.exists);

            assert.isFalse (isExists);
        
        },
        'compile is NOT set,': function (params) { assert.isFalse (params.compile); },
        'base64 encode is NOT set.': function (params) { assert.isFalse (params.base64); },
        
        
    }

});


normalizeSuite.addBatch({

    'Sending config only with output returns:': {

        topic: function () {

            return normalize(testFour, pathToConfig);

        },

        'error.': function (params) { assert.instanceOf (params, Error); },

    }

});

normalizeSuite.addBatch({

    'Sending config with two wrong input urls returns:': {

        topic: function () {

            return normalize(testFive, pathToConfig);

        },

        'error.': function (params) { assert.instanceOf (params, Error); },
        
    }

});


exports.normalizeSuite = normalizeSuite;