var path   = require('path');
var fs     = require('fs');

var stylus = require('stylus');
var nib = require('nib');

// regex used in searches

var REGEX_IMPORTS      = new RegExp('@import (url\\()?["\']?(?!http[s]?://|/)([\\w\\d\\s!./\\-\\_]*\\.(css|styl))["\']?[)]?([\\w\\s,0-9:\\-\\(\\)<>]*)?[;]?', 'ig');
var REGEX_RESOURCES    = new RegExp('url\\(["\']?(?!http[s]?|/)([\\w\\d\\s!./\\-\\_]*\\.[\\w?#]+)["\']?\\)', 'ig');
var REGEX_CSS_COMMENTS = new RegExp('\\/\\*[^\\*]*\\*\\/', 'ig');


exports.init = function init(input, output) {

    var data = '';

    if ((typeof input) === 'string') {

        var result = importsReplace(input, output);

        if (result instanceof Error) return result;

        data += result;

    } else {

        for (var i = 0; i < input.length; i++) {

            var result = importsReplace(input[i], output);

            if (result instanceof Error) return result;

            data += result;

        }

    }

    return data;

};

// find and replace content of the imports in the files

var importsReplace = exports.importsReplace = function importsReplace(pathToFile, baseDir) {

    if (fs.existsSync(pathToFile)) {

        var data = fs.readFileSync(pathToFile, 'utf-8');

        data = data.replace(REGEX_CSS_COMMENTS, '');

        var isStylusFile = (path.extname(pathToFile) === '.styl');

        if (isStylusFile) {

            stylus(data).set('filename', pathToFile).import('nib').use(nib()).render(function(err, css) {

                if (err) throw err;

                data = css;

            });

        }

        var fileDir = path.dirname(pathToFile);

        data = importsSearch(data, fileDir);

        if (data instanceof Error) {

            data = data.toString().match(REGEX_IMPORTS);

            return new Error('Link "' + data[0] + '" in "' + pathToFile +'" is broken.');

        }

        data = resolvePaths(data, fileDir, baseDir);

        data = '/* ' + path.basename(pathToFile) + ' */\n\n' + data + '\n\n';

        return data;

    } else {

        return new Error('File not found "' + pathToFile + '".');

    }

};


// search for imports

var importsSearch = exports.importsSearch = function importsSearch(data, dir) {

    var importsList = data.match(REGEX_IMPORTS);

    if ( importsList != undefined ) {

        for ( var i = 0; i < importsList.length; i++ ) {
            
            var pathToCSSFile = path.resolve(dir, importsList[i].replace(REGEX_IMPORTS, '$2'));

            var mediaQuery = importsList[i].replace(REGEX_IMPORTS, '$4');

            var compiledImport = importsReplace(pathToCSSFile, dir);

            if (compiledImport instanceof Error) return new Error(importsList[i]);

            if (mediaQuery != '') compiledImport = '@media' + mediaQuery + ' {\n\n' + compiledImport + '}\n\n';

            data = data.replace(importsList[i], compiledImport);

        }

    }

    return data;

};


// resolves path to resources to the new relative path

var resolvePaths = exports.resolvePaths = function resolvePaths(data, dir, base) {

    var resources = data.match(REGEX_RESOURCES);

    if (resources != undefined) {

        for (x = 0; x < resources.length; x++) {

            var pathToResource = resources[x].replace(REGEX_RESOURCES, '$1');

            var absolutePath = path.join(dir, pathToResource);

            var newPath = path.relative(base, absolutePath);

            newPath = newPath.replace(/\\/ig, '/');

            data = data.replace(resources[x], 'url("' + newPath + '")');

        }

    }

    return data;

};