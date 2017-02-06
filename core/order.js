//load modules
var fs = require('fs');
var request = require('request');

//laat filelocation
var fileLocation = JSON.parse(fs.readFileSync("./temp/fileLocation.txt")).fileLocation;

//laat config
var config = JSON.parse(fs.readFileSync(fileLocation+"/config.json"));

//laat andere script codes
var configGetter = require(fileLocation+'/configGetter.js');
var ConsoleColor = require(fileLocation+'/ConsoleColor.js');
var bittrex = require(fileLocation+'/core/node.bittrex.api/node.bittrex.api.js');

//vraag alle order settings op
var settingOrdersBittrex = config.orders.bittrex;
var settingOrdersPoloniex = config.orders.poloniex;

//get orders settings
function makesqlReuqest(){
    
    //memory db
    var sendOpdracht = [];
    
    sendOpdracht.push(JSON.stringify({
        'bittrex': config.orders.bittrex,
        'poloniex': config.orders.poloniex
    }));
    
    sendDataNaarDeServer(sendOpdracht);
}

//request
function sendDataNaarDeServer(sendOpdracht){
    
    // Set the headers
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    
    // Configure the request
    var options = {
        url: 'http://'+config.hostConnection.ip+':'+config.hostConnection.poort+'/api/ordersSqlQuery',
        method: 'POST',
        headers: headers,
        form: sendOpdracht
    };

    // Start the request
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            
            //send data door naar makeOrder function
            makeOrder(body);
            
        } else{
            console.error(ConsoleColor.error()+"Er is een probleem om de sql te sturen naar de server. Probleem bij order.js.");
        }
    });
}

//verwerkt request data
function makeOrder (body){
    
};

//stuur trade id naar de server
function tradeID(){
    
}

//start order.js
makesqlReuqest();

//geef in de terminal aan dat order.js beschikbaar is
console.log(ConsoleColor.log()+"Order.js is opgestart.");