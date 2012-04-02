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
        var listOfArguments = ((oldArgv[i].indexOf('-') === 0) && (oldArgv[i].indexOf('-') !== 1));
        var base64Value     = /^--base64=/.test(oldArgv[i]);
        var base64Default   = /^--base64[^=]+/.test(oldArgv[i]);
        var compressValue   = /^--compress=/.test(oldArgv[i]);
        var compressDefault = /^--compress[^=]+/.test(oldArgv[i]);

        if (configPath) global.config = path.join(process.cwd(), oldArgv[i]);

        if (stylePath && inputUndefined) global.input = oldArgv[i];

        var notEqualsInput  = (oldArgv[i] !== global.input);

        if (stylePath && notEqualsInput && global.input) global.output = oldArgv[i];

        if (listOfArguments) {

            var tempArgv = oldArgv[i].toString().replace('-', '').split('');

            for (var j = 0; j < tempArgv.length; j++) {

                if ((tempArgv[j] === 'c') && (global.compress === undefined)) global.compress = true;
                if ((tempArgv[j] === 'b') && (global.base64 === undefined)) global.base64  = true;

            }

        }
        
        if (base64Value) {
            
            var tmpValue = oldArgv[i].replace('--base64=', '');
            
            if (tmpValue === 'false') global.base64 = false;
            
            else if (tmpValue === 'true')  global.base64 = true;

            else global.base64 = tmpValue;

        }
        
        if (base64Default) global.base64 = true;

        if (compressValue) {
            
            var tmpValue = oldArgv[i].replace('--compress=', '');
            
            if (tmpValue === 'false') global.compress = false;
            
            else if (tmpValue === 'true')  global.compress = true;
            
            else global.compress = tmpValue;

        }
        
        if (compressDefault) global.compress = true;        

    };


    // normalizing results of returning error if no confing or css file is send

    if (global.config) {

        if (path.existsSync(global.config)) {

            var configDir  = path.dirname(global.config);

            var configFile = JSON.parse(fs.readFileSync(global.config));

            // merging config and global flags

            configFile.compress = (global.compress !== undefined) ? global.compress : configFile.compress;
            configFile.base64   = (global.base64 !== undefined) ? global.base64 : configFile.base64;

            params = [configFile, configDir];

        }
    
    else {

        return new Error('Config file not found at provided path.');

    }


    } else if (global.input) {

        params = [global, process.cwd()];

    } else return new Error('You need to send config or style file.');


    // returns params or error

    delete params[0].config;

    return params;

}