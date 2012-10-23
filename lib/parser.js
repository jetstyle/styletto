"use strict";

var path      = require( 'path' );
var fs        = require( 'fs' );
var colors    = require( 'colors' );

var Processor = require( './processor' ).process;


// regex used in searches

var REGEX_IMPORTS      = new RegExp( '@import (url\\()?["\']?(?!http[s]?://|/)([\\w\\d\\s!./\\-\\_]*\\.[\\w?#]+)["\']?[)]?([\\w\\s,0-9:\\-\\(\\)<>]*)?[;]?', 'ig' );
var REGEX_RESOURCES    = new RegExp( 'url\\(["\']?(?!http[s]?|/)([\\w\\d\\s!./\\-\\_]*\\.[\\w?#]+)["\']?\\)', 'ig' );
var REGEX_CSS_COMMENTS = new RegExp( '\\/\\*[^\\*]*\\*\\/', 'ig' );

var errorMsg = '';

module.exports = Parser;


function Parser ( config, collection ) {

    this.config = config;
    this.collection = collection;

}

Parser.prototype.parse = function ( callback ) {

    var data   = '';

    for ( var i = 0; i < this.config.input.length; i++ ) {

        var compiledImport = this.importsReplace( this.config.input[i], this.config.resolvePath );

        if ( compiledImport ) {

            data += compiledImport;

        }

        if ( this.collection.criticalError ) {

            return callback( this.collection, data );

        }

    }

    return callback( this.collection, data );

};


// find and replace content of the imports in the files

Parser.prototype.importsReplace = function ( pathToFile, baseDir, importFile, relativePath ) {

    if ( fs.existsSync( pathToFile ) ) {

        var data = fs.readFileSync( pathToFile, 'utf-8' );

        var fileExtension = path.extname( pathToFile );

        var fileDir = path.dirname( pathToFile );

        data = data.replace( REGEX_CSS_COMMENTS, '' );

        var processed = new Processor( data, fileExtension, pathToFile, this.config.nib );

        if ( processed.error ) {

            this.collection.parseError( 'processors', processed.error );

            data = processed.raw;

        }

        else {

            data = processed.result;

        }

        data = this.importsSearch( data, fileDir, pathToFile );

        data = this.resolvePaths( data, fileDir, baseDir );

        data = '/* ' + path.basename( pathToFile ) + ' */\n\n' + data + '\n\n';

        return data;

    }

    else if ( importFile !== undefined ) {

        errorMsg = '@import "' + relativePath + '" in "' + importFile +'" is broken.';

        this.collection.parseError( 'imports', errorMsg );

        return  false;


    }

    else {

        errorMsg =  'File not found "' + pathToFile + '".';

        this.collection.parseError( 'imports', errorMsg );

        return false;

    }

};


// search for imports

Parser.prototype.importsSearch = function ( data, dir, parentFile ) {

    var importsList = data.match( REGEX_IMPORTS );

    if ( importsList !== null ) {

        for ( var i = 0; i < importsList.length; i++ ) {

            var relativePath = importsList[i].replace( REGEX_IMPORTS, '$2' );

            var pathToCSSFile = path.resolve( dir, relativePath );

            var mediaQuery = importsList[i].replace( REGEX_IMPORTS, '$3' );

            var compiledImport = this.importsReplace( pathToCSSFile, dir, parentFile, relativePath );

            if ( this.collection.criticalError ) {

                return data;

            }

            if ( compiledImport ) {

                if ( mediaQuery !== '' ) {

                    compiledImport = '@media' + mediaQuery + ' {\n\n' + compiledImport + '}\n\n';

                }

                data = data.replace( importsList[i], compiledImport );

            }

        }

    }

    return data;

};

// resolves path to resources to the new relative path

Parser.prototype.resolvePaths = function ( data, dir, base ) {

    var resources = data.match( REGEX_RESOURCES );

    if ( resources !== null ) {

        for ( var x = 0; x < resources.length; x++ ) {

            var pathToResource = resources[x].replace( REGEX_RESOURCES, '$1' );

            var absolutePath = path.join( dir, pathToResource );

            var newPath = path.relative( base, absolutePath );

            newPath = newPath.replace( /\\/ig, '/' );

            data = data.replace( resources[x], 'url("' + newPath + '")' );

        }

    }

    return data;

};
