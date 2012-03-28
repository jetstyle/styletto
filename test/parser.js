var vows   = require('vows');
var assert = require('assert');
var fs     = require('fs');
var path   = require('path');

var parser = require('../lib/parser');

var resourcesTextSuite = fs.readFileSync('examples/b-resources/b-resources.css', 'utf-8');

var parserSuite = vows.describe('Parser module tests');

parserSuite.addBatch({

    'File source replace:': {

        topic: function () {

            return parser.resolvePaths(resourcesTextSuite, '../examples/b-resources/', '../examples/');

        },

        'woff path fixed,': function (data) { assert.include (data, 'url("b-resources/b-resources.woff")'); },

        'png path fixed,': function (data) { assert.include (data, 'url("b-resources/b-resources.png")'); },

        'jpeg path fixed,': function (data) { assert.include (data, 'url("b-resources/b-resources.jpeg")'); },

        'jpg path fixed,': function (data) { assert.include (data, 'url("b-resources/b-resources.jpg")'); },

        'png path fixed,': function (data) { assert.include (data, 'url("b-resources/b-resources.png")'); },

        'gif path fixed,': function (data) { assert.include (data, 'url("b-resources/b-resources.gif")'); },

        'svg path fixed,': function (data) { assert.include (data, 'url("b-resources/b-resources.svg")'); },

        'web paths NOT fixed,': function (data) {

            var webOne = data.indexOf('.b-resources__web-one { background: url("http://www.google.com/images/srpr/logo3w.png"); }') !== -1;

            var webTwo = data.indexOf('.b-resources__web-two { background: url(http://www.google.com/images/srpr/logo3w.png); }') !== -1;

            var webThree = data.indexOf('.b-resources__web-three { background: url(\'http://www.google.com/images/srpr/logo3w.png\'); }') !== -1;

            var allWebWorked = (webOne && webTwo && webThree);

            assert.isTrue (allWebWorked);
            

        },
        'absolute paths NOT fixed.': function (data) {
        
            var absoluteOne = data.indexOf('.b-resources__absolute-one { background: url("/b-resources.png"); }') !== -1;

            var absoluteTwo = data.indexOf('.b-resources__absolute-two { background: url(/b-resources.png); }') !== -1;

            var absoluteThree = data.indexOf('.b-resources__absolute-three { background: url(\'/b-resources.png\'); }') !== -1;

            var allAbsoluteWorked = (absoluteOne && absoluteTwo && absoluteThree);

            assert.isTrue (allAbsoluteWorked);
        },

    }

});

exports.parserSuite = parserSuite;