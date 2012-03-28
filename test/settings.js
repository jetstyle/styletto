var vows   = require('vows');
var assert = require('assert');
var fs     = require('fs');
var path   = require('path');

var settings = require('../lib/settings');

var settingsSuite = vows.describe('Settings module tests');


settingsSuite.addBatch({

    'Calling "styletto -bc examples/all.css examples/__all.css" returns:': {

        topic: function () {

            return settings(['-bc', 'examples/all.css', 'examples/__all.css']);

        },

        'input location is "examples/all.css",': function (params) { assert.equal (params[0].input, 'examples/all.css'); },

        'output location is "examples/__all.css",': function (params) { assert.equal (params[0].output, 'examples/__all.css'); },

        'compile content is set,': function (params) { assert.isTrue (params[0].compile); },

        'base64 encode is set.': function (params) { assert.isTrue (params[0].base64); },
        
    }

});

settingsSuite.addBatch({

    'Calling "styletto examples/all.css" returns:': {

        topic: function () {

            return settings(['examples/all.css']);

        },

        'input location IS "examples/all.css",': function (params) { assert.equal (params[0].input, 'examples/all.css'); },

        'output location IS NOT set,': function (params) { assert.isUndefined (params[0].output); },

        'compile content IS NOT set,': function (params) { assert.isUndefined (params[0].compile); },

        'base64 encode IS NOT set.': function (params) { assert.isUndefined (params[0].base64); },
        
    }

});

settingsSuite.addBatch({

    'Calling "styletto examples/config.json" returns:': {

        topic: function () {

            return settings(['examples/config.json']);

        },

        'input location IS ARRAY,': function (params) { assert.isArray (params[0].input); },

        'output location IS "_all.css",': function (params) { assert.equal (params[0].output, '_all.css'); },

        'compile content IS NOT set,': function (params) { assert.isFalse (params[0].compile); },

        'base64 encode IS set.': function (params) { assert.isTrue (params[0].base64); },
        
    }

});

settingsSuite.addBatch({

    'Calling "styletto -bc" returns:': {

        topic: function () {

            return settings(['-bc']);

        },

        'error.': function (params) { assert.instanceOf (params, Error); },

        
    }

});


exports.settingsSuite = settingsSuite;