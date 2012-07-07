// dependencies

var fs     = require('fs');
var util   = require('util');
var path   = require('path');

var normalize = require('./normalize');
var parser    = require('./parser').init;


var init = exports.init = function(config, dir, callback) {

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

var prepareFile = exports.prepareFile = function(data, params, resolvePath) {

    if (params.base64)   data = base64Replace(data, resolvePath, params.base64);

    if (params.compress) data = compressReplace(data, params.compress);

    if (params.output) {

        fs.writeFileSync(params.output, data);

        return NaN;

    } else {

        return data;

    };

};

var compressReplace = exports.compressReplace = function(data, type) {

    if (type === 'csso') {

        var csso = require('csso');

        data = csso.justDoIt(data);

    } else if (type === 'yui') {

        var yui = require('css-compressor').cssmin;

        data = yui(data);

    }

    return data;

}

var base64Replace = exports.base64Replace = function(data, dir, maxSize) {

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

            if (fs.existsSync(absolutePath)) {

                var image = fs.readFileSync(absolutePath);

                var mime = mimes[path.extname(absolutePath)];

                if (image.length <= maxSize) {

                    data = data.replace(resources[i], 'url("data:' + mime + ';base64,' + image.toString('base64') + '")');

                }

            }

        }

    }

    return data;

};
