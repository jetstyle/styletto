About
=====

**styletto** is a simple css assets manager written on node.js. Requires node.js and npm to work and install.

It can take one of more .css or .styl files as input and join them to one. It differs from on other assent menages in following ways:

1. It automatically and recursively includes imported css (from @import rules) to output file with exception of absolute paths.
2. It resolves relative resources paths (images, fonts) to the given output file destination.
3. It can compress output file and base64 encode images in it.
4. It works with stylus css markup language.


Installation
============

1. Download source code.
2. Unpack.
3. Run to install on the system path:

        cd /path_download_folder
        npm install -g


Usage
=====

Usage: styletto [options] inputFile [outputFile]

inputFile can be either: .css, .stylus or config file.

If no outputFile given it will return created file to the stdout.

Options:

    -c            Compress output file using csso
    -b            Encode images to base64
    -h, --help    Display help information


Config format
=============

Full config example:

    {
        "input": ["dir/first.css", "dir/second.styl"],
        "output": "output.css",
        "compile": false,
        "base64": true
    }

Minimal config:

    {
        "input": "dir/file.css",
    }

If flags "-b" or "-c" is set in command line, then their values will overwrite config's ones.