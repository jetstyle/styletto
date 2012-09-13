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
            this.data = csso.justDoIt( this.data );
            break;

        case 'yui':

            var yui = require( 'css-compressor' ).cssmin;
            this.data = yui( this.data );
            break;

    }
};

Uglifier.prototype.base64 = function() {

    var REGEX_IMAGES = new RegExp( 'url\\(["\']?(?!http[s]?|/)([\\w\\d\\s.!/\\-\\_]*\\.(gif|jpg|jpeg|png|svg)+)["\']?\\)', 'ig' );

    var mimes = {
        '.gif': 'image/gif',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.svg': 'image/svg+xml'
    };

    var resources = this.data.match( REGEX_IMAGES );

    if ( resources !== null ) {

        for ( var i = 0; i < resources.length; i++ ) {

            var relativePath = resources[i].replace( REGEX_IMAGES, '$1' );

            var absolutePath = path.join( this.params.resolvePath, relativePath );

            if ( fs.existsSync( absolutePath ) ) {

                var image = fs.readFileSync( absolutePath );

                var mime = mimes[path.extname( absolutePath )];

                if ( image.length <= this.params.base64 ) {

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
