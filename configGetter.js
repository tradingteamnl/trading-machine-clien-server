//load modules
var fs = require('fs');

//laat filelocation
var fileLocation = JSON.parse(fs.readFileSync("./temp/fileLocation.txt")).fileLocation;

//laat config
var config = JSON.parse(fs.readFileSync(fileLocation+"/config.json"));

//getter voor de post url
exports.postURL = function(){
    return config.hostConnection.protocall+'://'+config.hostConnection.ip+':'+config.hostConnection.poort;
};

//getter voor de server url
exports.serverURL = function(){
    return config.hostConnection.protocall+'://'+config.hostConnection.ip+':'+config.hostConnection.poort;
};

//bittrex request data
exports.bittrexOptions = function(){
    
    //collect bittrex option
    var bittrexOptions = ({
        'apikey' : config.bittrex.apiKey,
        'apisecret' : config.bittrex.apiSecretKey,
        'stream' : config.bittrex.stream,
        'verbose' : config.bittrex.verbose,
        'cleartext' : config.bittrex.cleartext
    });
    
    return bittrexOptions;
};