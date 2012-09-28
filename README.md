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
      -c, --compress            Compress output file using either "csso"
                                or "yui" compressor, default is "csso"
      -b, --base64[=size]       Encode images to base64, images that are more
                                than "size" value in bytes will not be encoded,
                                default size is "10000" bytes
      --path[=dir]              Path to directory from which path to inputFile and
                                outputFile will be resolved, default is
                                current directory.

    Error handling rules: "error" will exit process without saving, "alert" will print
    error text to stderr but will also try to finish compiling, "ignore" will try
    to finish compiling without printing an error message.

      --errors[=rule]                  Shortcut for all rules at once

      --errors-imports[=rule]          Default is "alert"
      --errors-resources[=rule]        Default is "ignore"
      --errors-processors[=rule]       Default is "error"


Usage from another app
======================

Usage: `styletto( config, function( err, success, css ) {} )`

* `err` will return string with errors if there any.
* `success` will return true or false. True if process finished and css is returned or saved to file, false if process was finished fithout saving.
* `css` if ther is no output file in config, then output css will be returned there.

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
        "input": ["dir/first.css", "dir/second.styl"],
        "output": "output.css",
        "compress": false,
        "base64": true,
        "path": "path/to/root/dir",
        "errors": {
            "resources": "alert",
            "imports": "ignore",
            "processors": "error"
        }
    }

Minimal config:

    {
        "input": "dir/file.css",
        "path": "path/to/root/dir"
    }

If config is loaded from console with some flags setted, then flags value will overwrite config's one.


Changelog
=========

### 0.3.3. What's new:
  - Fixed bug then .styl files with variables and mixins (i.e. mixin library) was rendered as raw stylus files instead of blank strings.

### 0.3.2. What's new:
  - Fixed behavior with -b and -c in the begining of the string.    

### 0.3.1. What's new:
  - Add temporary fix to help for greedy argument parser in console arguments.
  - Fixed error then false values of compress and base64 flags didn't revrite values in config.    

### 0.3.0. What's new:
  - Detailed control for error reporting.
  - You can now send path to base dir from console as well as from config.
  - Less support.
  - Changed internal API.
  - Full rewrite inside.
  - Ton of bugfixes.
