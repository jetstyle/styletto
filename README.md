About  [![Build Status](https://secure.travis-ci.org/iAdramelk/styletto.png)](http://travis-ci.org/iAdramelk/styletto)
=====

**styletto** is a simple css assets manager written on node.js. Requires node.js and npm to work and install.

It can take one of more .css or .styl files as input and join them to one. It differs from on other assent menages in following ways:

1. It automatically and recursively includes imported css (from @import rules) to output file with exception of absolute paths.
2. It resolves relative resources paths (images, fonts) to the given output file destination.
3. It can compress output file and base64 encode images in it.
4. It works with stylus css markup language.


Installation
============

```npm install styletto -g```

Terminal usage
==============

Usage: ```styletto [options] inputFile [outputFile]```

inputFile can be either: .css, .stylus or config file.

If no outputFile given it will return created file to the stdout.

Options:

    -h, --help                Displays help information
    -v, --version             Displays package version
    -c, --compress[=engine]   Compress output file using either "csso"
                              or "yui" compressor. Default is csso
    -b, --base64[=size]       Encode images to base64, images that are more
                              than "size" value in bytes will not be enoded,
                              default size is 10000 bytes


Usage from another app
======================

Usage: ```styletto(config, targetDir, callback)```

Function will return either error, result or NaN (if content is written to file).

Example:

    var styletto = require("styletto");
    
    var config = {
        "input": ["dir/first.css", "dir/second.styl"],
        "output": "output.css",
        "compress": "csso",
        "base64": 15000
    }
    
    styletto(config, "/path/to/dir/there/to/resolve/", function(err, result) {

        if (err) throw err;
        
        else if (result) do something
        
        else console.log("\nIt's saved!");

    });


Config format
=============

Full config example:

    {
        "input": ["dir/first.css", "dir/second.styl"],
        "output": "output.css",
        "compress": false,
        "base64": true
    }

Minimal config:

    {
        "input": "dir/file.css",
    }

If flags "-b" or "-c" is set in command line, then their values will overwrite config's ones.