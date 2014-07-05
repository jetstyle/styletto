"use strict";

var path      = require( 'path' );
var fs        = require( 'fs' );
var colors    = require( 'colors' );
var async     = require( 'async' );

var Processor = require( './processor' ).process;


// regex used in searches

var REGEX_IMPORTS      = new RegExp( '@import (url\\()?["\']?(?!http[s]?://|/)([\\w\\d\\s!./\\-\\_]*\\.[\\w?#]+)["\']?[)]?([\\w\\s,0-9:\\-\\(\\)<>]*)?[;]?', 'ig' );
var REGEX_RESOURCES    = new RegExp( 'url\\(["\']?(?!http[s]|data|/)([\\w\\d\\s!./\\-\\_]*\\.[\\w\\s?=#&\\.]+)["\']?\\)', 'ig' );
var REGEX_CSS_COMMENTS = new RegExp( '\\/\\*[^\\*]*\\*\\/', 'ig' );

var errorMsg = '';

module.exports = Parser;


/**
 *
 * Creates an instance of Parser.
 *
 * @constructor
 * @this {Parser}
 * @param {object} config Normalized styletto config.
 * @param {object} collection Object ther all error reportst will be added.
 *
 */


function Parser ( config, collection ) {

    this.config = config;
    this.collection = collection;

}


/**
 *
 * Parse files given in this.config and use this.collection
 * for error reporting.
 *
 * @param {function(err, result)} callback Result of parsers work.
 *
 */


Parser.prototype.parse = function ( callback ) {

    var that     = this,
        data     = '',
        srcArray = [],
        item;

    // Creating array of arguments to start async.map() for this.importsReplace

    for ( item = 0; item < that.config.input.length; item++ ) {

        srcArray.push( {
            baseDir: that.config.resolvePath,
            importFile: undefined,
            relativePath: that.config.input[ item ],
            mediaQuery: '',
            that: that
        } );

    }

    async.map( srcArray, that.importsReplace, function( err, resultsArray ) {

        for ( item = 0; item < resultsArray.length; item++ ) {

            var c = resultsArray[ item ];

            data += ( c.compiled ) ? c.compiled : '';

        }

        return callback( null, { collection: that.collection, data: data } );

    } );

};


// find and replace content of the imports in the files

Parser.prototype.importsReplace = function ( f, callback ) {

    var pathToFile = path.resolve( f.baseDir, f.relativePath ),
        that = f.that;

    if ( fs.existsSync( pathToFile ) ) {

        var fileExtension = path.extname( pathToFile );

        var fileDir = path.dirname( pathToFile );

        async.waterfall( [

            function( callback ) {

                fs.readFile( pathToFile, 'utf-8', function( err, data ) {

                    if ( err ) {

                        throw err;

                    }

                    data = data.replace( REGEX_CSS_COMMENTS, '' );

                    callback( null, data );

                } );

            },

            function( data, callback ) {

                new Processor( data, fileExtension, pathToFile, that.config ).parse( function( err, data ) {

                    if ( err ) {

                        that.collection.parseError( 'processors', err );

                    }

                    callback( null, data );

                } );

            },

            function( data, callback ) {

                that.importsSearch( data, fileDir, pathToFile, that, function( err, data ) {

                    callback( null, data );

                } );

            },

            function( data , callback ) {

                data = that.resolvePaths( data, fileDir, f.baseDir, that );

                data = '/* ' + f.relativePath + ' */\n\n' + data + '\n\n';

                if ( f.mediaQuery !== '' ) {

                    data = '@media' + f.mediaQuery + ' {\n\n' + data + '}\n\n';

                }

                f.compiled = data;


                callback( null, f );

            }

        ], function (err, f ) {


            callback( null, f );

        });

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

Parser.prototype.importsSearch = function ( data, dir, parentFile, that, callback ) {

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


        async.map( filesList, that.importsReplace, function( err, results ) {

            for ( var n = 0; n < importsList.length; n++ ) {

                var r = importsList[ n ];

                var relativePath = r.replace( REGEX_IMPORTS, '$2' );

                for ( var p = 0; p < results.length; p++ ) {

                    if ( results[ p ].relativePath === relativePath ) {

                        data = data.replace( r, results[ p ].compiled );

                        break;

                    }

                }

            }

            return callback( null, data );

        } );

    }

    else {

        return callback( null, data );

    }

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
