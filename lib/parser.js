"use strict";

var path      = require( 'path' );
var fs        = require( 'fs' );
var colors    = require( 'colors' );
var async     = require( 'async' );

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

    var that          = this,
        data          = '',
        files         = that.config.input,
        filesList     = [];

    for ( var f in files ) {

        filesList.push( {
            baseDir: that.config.resolvePath,
            importFile: undefined,
            relativePath: files[ f ],
            mediaQuery: '',
            that: that
        } );

    }

    var compiledFiles = that.asyncCompile( filesList, that );

    for ( var file in compiledFiles ) {

        var c = compiledFiles[ file ];

        data += ( c.compiled ) ? c.compiled : '';

    }

    return callback( that.collection, data );

};


Parser.prototype.asyncCompile = function ( files, that ) {

    var result;

    async.map( files, that.importsReplace, function( err, results ) {

        result = results;

    } );

    if ( that.collection.criticalError ) {

        return result;

    }

    return result;

};


// find and replace content of the imports in the files

Parser.prototype.importsReplace = function ( f, callback ) {

    var pathToFile = path.resolve( f.baseDir, f.relativePath ),
        that = f.that;

    if ( fs.existsSync( pathToFile ) ) {

        var data = fs.readFileSync( pathToFile, 'utf-8' );

        var fileExtension = path.extname( pathToFile );

        var fileDir = path.dirname( pathToFile );

        data = data.replace( REGEX_CSS_COMMENTS, '' );

        var processed = new Processor( data, fileExtension, pathToFile, that.config.nib );

        if ( processed.error ) {

            that.collection.parseError( 'processors', processed.error );

            data = processed.raw;

        }

        else {

            data = processed.result;

        }

        data = that.importsSearch( data, fileDir, pathToFile, that );

        data = that.resolvePaths( data, fileDir, f.baseDir, that );

        data = '/* ' + f.relativePath + ' */\n\n' + data + '\n\n';

        if ( f.mediaQuery !== '' ) {

            data = '@media' + f.mediaQuery + ' {\n\n' + data + '}\n\n';

        }

        f.compiled = data;

        callback( null, f );

    }

    else if ( f.importFile !== undefined ) {

        errorMsg = '@import "' + f.relativePath + '" in "' + f.importFile +'" is broken.';

        that.collection.parseError( 'imports', errorMsg );

        callback( null, false );


    }

    else {

        errorMsg =  'File not found "' + pathToFile + '".';

        that.collection.parseError( 'imports', errorMsg );

        callback( null, false );

    }

};


// search for imports

Parser.prototype.importsSearch = function ( data, dir, parentFile, that ) {

    var importsList = data.match( REGEX_IMPORTS ),
        filesList = [];

    if ( importsList !== null ) {

        for ( var importFile in importsList ) {

            var i = importsList[ importFile ];

            filesList.push( {
                baseDir: dir,
                importFile: parentFile,
                mediaQuery: i.replace( REGEX_IMPORTS, '$3' ),
                relativePath: i.replace( REGEX_IMPORTS, '$2' ),
                that: that
            } );

        }

        var compiledFiles = that.asyncCompile( filesList, that );

        for ( var importResult in importsList ) {

            var r = importsList[ importResult ];

            var relativePath = r.replace( REGEX_IMPORTS, '$2' );

            for ( var p in compiledFiles ) {

                if ( compiledFiles[ p ].relativePath === relativePath ) {

                    data = data.replace( r, compiledFiles[ p ].compiled );

                    break;

                }

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
