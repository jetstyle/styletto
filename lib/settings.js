var path = require('path');
var fs   = require('fs');

module.exports = function (oldArgv) {

    var params = [];
    var global = { config: false };


    // filter command line arguments

    for (var i = 0; i < oldArgv.length; i++) {

        var stylePath       = /\.css|\.styl/.test(oldArgv[i]);
        var configPath      = /\.json/.test(oldArgv[i]);
        var inputUndefined  = (global.input === undefined);
        var listOfArguments = (oldArgv[i].indexOf('-') === 0);

        if (configPath) global.config = path.join(process.cwd(), oldArgv[i]);

        if (stylePath && inputUndefined) global.input = oldArgv[i];

        var notEqualsInput  = (oldArgv[i] !== global.input);

        if (stylePath && notEqualsInput && global.input) global.output = oldArgv[i];

        if (listOfArguments) {

            var tempArgv = oldArgv[i].toString().replace('-', '').split('');

            for (var j = 0; j < tempArgv.length; j++) {

                if (tempArgv[j] === 'c') global.compile = true;
                if (tempArgv[j] === 'b') global.base64  = true;

            }

        }

    };


    // normalizing results of returning error if no confing or css file is send

    if (global.config) {

        var configDir  = path.dirname(global.config);
        var config     = require('konphyg')(configDir);
        var configFile = config(path.basename(global.config, '.json'));

        // merging config and global flags

        configFile.compile = global.compile || configFile.compile;
        configFile.base64  = global.base64  || configFile.base64;

        params = [configFile, configDir];

    } else if (global.input) {

        params = [global, process.cwd()];

    } else return new Error('You need to send config or style file.');


    // returns params or error

    delete params[0].config;

    return params;

}