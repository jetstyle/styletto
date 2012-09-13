"use strict";

var vows      = require('vows');
var assert    = require('assert');
var fs        = require('fs');
var path      = require('path');
var optimist  = require('optimist');

var settings  = require('../lib/settings');

var argumentsList = {

    help: {
        alias: 'h',
        boolean: true
    },

    version: {
        alias: 'v',
        boolean: true
    },

    compress: {
        alias: 'c',
        short: 'c'
    },

    base64: {
        alias: 'b',
        short: 'b'
    },

    path: {
        default: false
    },

    errors: {},

    'errors-includes': { },

    'errors-resources': { },

    'errors-processors': { }

};


var settingsSuite = vows.describe('Settings module tests');

settingsSuite.addBatch({

    'Calling "styletto -bc examples/all.css examples/__all.css" returns:': {

        topic: function () {

            return settings(optimist(['examples/all.css', 'examples/__all.css', '-bc']).options(argumentsList).argv);

        },

        'input location is "examples/all.css",': function (params) { assert.equal (params.input, 'examples/all.css'); },

        'output location is "examples/__all.css",': function (params) { assert.equal (params.output, 'examples/__all.css'); },

        'compress content is set,': function (params) { assert.isTrue (params.compress); },

        'base64 encode is set.': function (params) { assert.isTrue (params.base64); },

    }

});

settingsSuite.addBatch({

    'Calling "styletto examples/all.css" returns:': {

        topic: function () {

            return settings(optimist(['examples/all.css']).options(argumentsList).argv);

        },

        'input location IS "examples/all.css",': function (params) { assert.equal (params.input, 'examples/all.css'); },

        'output location IS NOT set,': function (params) { assert.isUndefined (params.output); },

        'compress content IS NOT set,': function (params) { assert.isUndefined (params.compress); },

        'base64 encode IS NOT set.': function (params) { assert.isUndefined (params.base64); },

    }

});

settingsSuite.addBatch({

    'Calling "styletto examples/config.json" returns:': {

        topic: function () {

            return settings(optimist(['examples/config.json']).options(argumentsList).argv);

        },

        'input location IS ARRAY,': function (params) { assert.isArray (params.input); },

        'output location IS "_all.css",': function (params) { assert.equal (params.output, '_all.css'); },

        'compress content IS NOT set,': function (params) { assert.isFalse (params.compress); },

        'base64 encode IS set.': function (params) { assert.isTrue (params.base64); },

    }

});

settingsSuite.addBatch({

    'Calling "styletto examples/config.json --compress=yui --base64=100000" returns:': {

        topic: function () {

            return settings(optimist(['examples/config.json', '--compress=yui', '--base64=100000']).options(argumentsList).argv);

        },

        'input location IS ARRAY,': function (params) { assert.isArray (params.input); },

        'output location IS "_all.css",': function (params) { assert.equal (params.output, '_all.css'); },

        'compress content IS set to "yui",': function (params) { assert.equal (params.compress, 'yui'); },

        'base64 encode IS set to "100000".': function (params) { assert.equal (params.base64, '100000'); },

    }

});

settingsSuite.addBatch({

    'Calling "styletto examples/config.json --base64=false" returns:': {

        topic: function () {

            return settings(optimist(['examples/config.json', '--base64=false']).options(argumentsList).argv);

        },

        'base64 encode IS NOT set.': function (params) { assert.isFalse (params.base64); },


    }

});



settingsSuite.addBatch({

    'Calling "styletto -bc" returns:': {

        topic: function () {

            return settings(optimist(['-bc']).options(argumentsList).argv);

        },

        'error.': function (params) { assert.instanceOf (params, Error); },


    }

});

settingsSuite.addBatch({

    'Calling "styletto nonexisiting-congif.json" returns:': {

        topic: function () {

            return settings(optimist(['nonexisiting-congif.json']).options(argumentsList).argv);

        },

        'error.': function (params) { assert.instanceOf (params, Error); },


    }

});



exports.settingsSuite = settingsSuite;
