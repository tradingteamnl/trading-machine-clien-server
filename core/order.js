//load modules
var fs = require('fs');
var request = require('request');

//laat filelocation
var fileLocation = JSON.parse(fs.readFileSync("./config/fileLocation.txt")).file;

//laat config
var config = JSON.parse(fs.readFileSync(fileLocation+"/config.json"));

//laat andere script codes
var configGetter = require(fileLocation+'/configGetter.js');
var ConsoleColor = require(fileLocation+'/ConsoleColor.js');
var bittrex = require(fileLocation+'/node.bittrex.api/node.bittrex.api.js');

//vraag alle order settings op
var settingOrdersBittrex = config.orders.bittrex;
var settingOrdersPoloniex = config.orders.poloniex;

//bij true door gaan
if(settingOrdersBittrex == true){
    
};

//request order setting






