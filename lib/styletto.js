// dependencies

var fs     = require('fs');
var util   = require('util');
var path   = require('path');

var csso   = require('csso');
var stylus = require('stylus');

var normalize = require('./normalize');
var parser    = require('./parser').init;

// globals

var BASE64_SIZE = '10000';


module.exports = function(config, dir, callback) {

    var data;

    var params = normalize(config, dir);

    if ( params instanceof Error ) return callback(params);

    // starting import search function

    var resolvePath;

    if (params.output) {

        resolvePath = path.dirname(params.output);

    } else {

        resolvePath = params.basedir;

    }

    data = parser(params.input, resolvePath);

    if ( data instanceof Error ) return callback(data);

    data = prepareFile(data, params, resolvePath);

    return callback(data);

};


function prepareFile(data, params, resolvePath) {

    if (params.base64) data = base64Replace(data, resolvePath);

    if (params.compile) data = csso.justDoIt(data);

    if (params.output) {

        fs.writeFileSync(params.output, data);

        return NaN;

    } else {

        return data;

    };

};


function base64Replace(data, dir) {

    var REGEX_IMAGES = new RegExp('url\\(["\']?(?!http[s]?|/)([\\w\\d\\s.!/\\-\\_]*\\.(gif|jpg|jpeg|png|svg)+)["\']?\\)', 'ig');

    var mimes = {
        '.gif': 'image/gif',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.svg': 'image/svg+xml'
    };

    var resources = data.match(REGEX_IMAGES);

    if (resources != undefined) {

        for (i = 0; i < resources.length; i++) {

            var absolutePath = path.join(dir, resources[i].replace(REGEX_IMAGES, '$1'));

            if (path.existsSync(absolutePath)) {

                var image = fs.readFileSync(absolutePath);

                var mime = mimes[path.extname(absolutePath)];

                if (image.length <= BASE64_SIZE) {

                    data = data.replace(resources[i], 'url("data:' + mime + ';base64,' + image.toString('base64') + '")');

                }

            }

        }

    }
    
    return data;

};