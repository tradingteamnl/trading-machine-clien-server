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
            console.log(body);
            for (i = 0; i < body.length; i++) { 
                    
                //hier laat het systeem de buy kant
                if(body[i].markttype == "buy"){
                    
                    var exportMemory= {

                        //maak een variable
                        id: body[i].id,
                        handelsplaats: body[i].handelsplaats,
                        coin: body[i].coin,
                        markttype: body[i].markttype,
                        prioriteit: body[i].prioriteit,
                        prijs: body[i].prijs,
                        hoeveelheid: body[i].hoeveelheid,
                        markt: body[i].markt,
                        maxCoinOnBalance: body[i].limiet,
                        besteprijs: body[i].besteprijs
                    };
                } 
                
                //hier laat het systeem de sell kant
                if(body[i].markttype =="sell"){

                    var exportMemory= {
                        //maak een variable
                        id: body[i].id,
                        handelsplaats: body[i].handelsplaats,
                        coin: body[i].coin,
                        markttype: body[i].markttype,
                        prioriteit: body[i].prioriteit,
                        prijs: body[i].prijs,
                        hoeveelheid: body[i].hoeveelheid,
                        markt: body[i].markt,
                        maxCoinOnBalance: body[i].limiet,
                        besteprijs: body[i].besteprijs
                    };
                }
                
                //geef variable door naar getBalance als het systeem gewoon de opgeven prijs moet handhaven
                if(besteprijs == 0){
                    getBalance(exportMemory);
                } else if(besteprijs == 5){
                    besteprijs(exportMemory);
                } else {
                    console.log(ConsoleColor.error()+"Er is een fout in de software.");
                    console.log(ConsoleColor.error()+"De opgeven optie voor beste prijs kan niet worden gevonden in het database.");
                }
            }
        } else{
            console.log(error);
            console.error(ConsoleColor.error()+"Er is een probleem om de sql te sturen naar de server. Probleem bij order.js.");
        }
    });
}

//functie op uittereken wat de beste prijs is voor het moment
function besteprijs(exportMemory){
    
    
    
}

//function vraag balance data op
function getBalance(){
    
};

//verwerkt data
function dataVerwerken(exportMemory){
    
    var data = exportMemory;
    
    
    
    
    
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