About  [![Build Status](https://secure.travis-ci.org/jetstyle/styletto.png)](http://travis-ci.org/jetstyle/styletto)
=====

**styletto** is a simple css assets manager written on node.js. Requires node.js and npm to work and install.

It can take one of more files as input and join them together. It differs from on other assent menages in following ways:

1. It automatically and recursively includes imported css (from @import rules) to output file with exception of absolute paths.
2. It resolves relative resources paths (images, fonts) to the given output file destination.
3. It can compress output file and base64 encode images in it.
4. It works with stylus and less css markup language.


Installation
============

`npm install styletto -g`

Terminal usage
==============

Usage: `styletto [options] inputFile [outputFile]`

    Options:

      -h, --help                Displays help information
      -v, --version             Displays package version
      -c, --compress[=engine]   Compress output file using either "csso"
                                or "yui" compressor, default is "csso"
      -b, --base64[=size]       Encode images to base64, images that are more
                                than "size" value in bytes will not be encoded,
                                default size is "10000" bytes
      --path[=dir]              Path to directory from which path to inputFile
                                and outputFile will be resolved, default is
                                current directory.

    Error handling rules: "error" will exit process without saving, "alert" will print
    error text to console but will also try to finish compiling, "ignore" will try
    to finish compiling without printing an error message.

      --errors[=rule]                  Shortcut for all rules

      --errors-imports[=rule]          Default is "alert"
      --errors-resources[=rule]        Default is "ignore"
      --errors-processors[=rule]       Default is "error"

    For additional settings, like filetypes for base64 conversion and
    automatic imports and variable instertions for stylus use config file.


Usage from another app
======================

Usage: `styletto( config, function( err, success, css ) {} )`

* `err` will return string with errors if there any.
* `success` will return true or false. True if process finished and css is returned or saved to file, false if process was finished without saving.
* `css` if there is no output file in config, then output css will be returned there.

Example:

    var styletto = require("styletto");

    var config = {
        "input": ["dir/first.css", "dir/second.styl"],
        "output": "output.css",
        "compress": "csso",
        "base64": 15000,
        "errors": "ignore",
        "path": process.cwd()
    }

    styletto( config, function(err, sucess, css ) {


    });


Config format
=============

Full config example:

    {
    "input": ["dir/first.css", "dir/second.styl", "dir/third.less"],
        "output": "output.css",
        "compress": false,
        "base64": {
            "limit": 1500,
            "types": {
                'gif':  'image/gif',
                'png':  'image/png',
                'jpg':  'image/jpeg',
                'jpeg': 'image/jpeg',
                'svg':  'image/svg+xml'
            }
        },
        "path": "path/to/root/dir",
        "errors": {
            "resources": "alert",
            "imports": "ignore",
            "processors": "error"
        },
        stylus: {
            variables: { 'ie': true },
            imports: [ "relative_path_to_mixin/if-ie.styl" ]
        },
        less: {
            variables: { 'color': 'red' },
            imports: [ "relative_path_to_mixin/lesshat.less" ]
        }
    }

Minimal config:

    {
        "input": "dir/file.css",
        "path": "path/to/root/dir"
    }

If config is loaded from console with some flags setted, then flags value will overwrite config's one.

Config-only flags:

**stylus** — you can set some set of variables and imports for use in every file here,
they will be added before rendering each file with .styl extension. Variables will be set first.

**Warning!** Variables need to be setted it JavaScript types. For example if you need to set 
array ( example: vendor-prefixes = webkit moz o ms official ), 
you need to write value as ["webkit", "moz", "o", "ms", "official"] and not as "webkit moz o ms official".

Example:

    stylus: {
        variables: {
            "vendor-prefixes": ["webkit", "moz", "o", "ms", "official" ],
            "ie" = true
        },
        imports: [ "if-ie.styl", "vendor.styl" ]
    }

**LESS** — you can set some set of variables and imports for use in every file here,
they will be added before rendering each file with .less extension. Variables will be set first.

LESS variables are always strings (paste them inside quotation marks)

Example:

    less: {
        variables: { "color": "red" },
        imports: [ 'lesshat.less' ]
    }

**base64**: base64 from config have optional extended syntax — you can optionally add filetypes for conversion (short syntax also works).

Example:

    base64: {
        limit: 1400,
        types: {
            'gif':  'image/gif',
            'png':  'image/png',
            'jpg':  'image/jpeg',
            'jpeg': 'image/jpeg',
            'svg':  'image/svg+xml'
        }
    }

Default types are: gif, png, jpg, jpeg, svg.


Changelog
=========

### 0.4.5 What's new:
  - Fixed bug with replacing '../font/fontawesome-webfont.eot?#iefix&v=3.2.1' urls.

### 0.4.3 What's new:
  - You can now add LESS variables and imports same way as stylus ones.

### 0.4.2 What's new:
  - Fixed possible bug with linked object send as config for styletto. Now it's properly unlinking configs before .changing them.

### 0.4.1 What's new:
  - stylus.mixins renamed to stylus.imports.

### 0.4.0 What's new:
  - Styletto is now asynchronous,
  - Nib and -n/--nib flags is removed from code.
  - You can now add stylus imports and variables from code.
  - You can now set filetypes and mimetypes for base64 conversion.
  - Fixed bug with less parser, then styletto broke while parsing less files with imports.

### 0.3.5 What's new:
  - Nib can now be disabled of partially enabled from settings. Possible values are: true, false, vendor (will only load vendor mixin from nib and ignore all else). It is set to 'vendor' by default for backwards compatibility. It will be set to false starting from version 0.5.0.

### 0.3.4 What's new:
  - Fast bugfix for nib bug with config.styl files. Temporally disabled all nib mixins except vendor and clearfix.

### 0.3.3. What's new:
  - Fixed bug then .styl files with variables and mixins (i.e. mixin library) was rendered as raw stylus files instead of blank strings.

### 0.3.2. What's new:
  - Fixed behavior with -b and -c in the beginning of the string.

### 0.3.1. What's new:
  - Add temporary fix to help for greedy argument parser in console arguments.
  - Fixed error then false values of compress and base64 flags didn't rewrite values in config.

### 0.3.0. What's new:
  - Detailed control for error reporting.
  - You can now send path to base dir from console as well as from config.
  - Less support.
  - Changed internal API.
  - Full rewrite inside.
  - Ton of bugfixes.
