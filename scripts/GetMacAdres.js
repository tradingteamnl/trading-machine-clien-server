//load modules
var os = require('os');

//export funtion
exports.getMacAdres = function(){
    return os.networkInterfaces().en0[0].mac;
};