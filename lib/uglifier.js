'use strict';

var fs = require( 'fs' );
var path = require( 'path' );

module.exports = Uglifier;

function Uglifier( data, params, collection ) {

    this.data = data;
    this.params = params;
    this.collection = collection;

}

Uglifier.prototype.uglify = function( callback ) {

    if ( this.params.base64 ) {

        this.base64();

    }

    if ( this.params.compress ) {

        this.compress();

    }

    return callback( this.data, this.collection );

};

Uglifier.prototype.compress = function() {

    switch ( this.params.compress ) {

        case 'csso':

            var csso = require( 'csso' );

            try {

                this.data = csso.justDoIt( this.data );

            } catch ( e ) {

                var errorMsg = e + ', can\'t compress because of it';

                this.collection.parseError( 'minifiers', errorMsg );

            }

            break;

        case 'yui':

            var cleanCSS = require('clean-css');
            this.data = cleanCSS.process( this.data );
            break;

    }
};

Uglifier.prototype.base64 = function() {

    var REGEX_IMAGES = new RegExp( 'url\\(["\']?(?!http[s]?|/)([\\w\\d\\s!./\\-\\_]*\\.([0-9a-zA-Z$!._\\-]+)[?#]*)["\']?\\)', 'ig' );

    var resources = this.data.match( REGEX_IMAGES );

    if ( resources !== null ) {

        for ( var i = 0; i < resources.length; i++ ) {

            var relativePath = resources[i].replace( REGEX_IMAGES, '$1' );

            var absolutePath = path.join( this.params.resolvePath, relativePath );

            if ( fs.existsSync( absolutePath ) ) {

                var image = fs.readFileSync( absolutePath );

                var extension = path.extname( absolutePath );

                extension = extension.slice( 1, extension.length );

                var acceptedType = ( this.params.base64.types[ extension ] !== undefined  );

                var acceptedSize = ( image.length <= this.params.base64.limit );

                if ( acceptedType && acceptedSize ) {

                    var mime = this.params.base64.types[ extension ];

                    this.data = this.data.replace( resources[i], 'url("data:' + mime + ';base64,' + image.toString( 'base64' ) + '")' );

                }

            }

            else {

                var errorMsg = 'Wrong resource path "' + relativePath + '"';

                this.collection.parseError( 'resources', errorMsg );

            }

        }

    }

};
