//load modules
var request = require('request');
var fs = require('fs');

//config
var autoConfig = JSON.parse(fs.readFileSync("./autoConfig.json"));
var config = JSON.parse(fs.readFileSync("./config.json"));
var fileLocation = JSON.parse(fs.readFileSync("./temp/fileLocation.txt")).file;

//load scripts
var bittrex = require(fileLocation+'/core/node.bittrex.api/node.bittrex.api.js');
var ConsoleColor = require(fileLocation+'/ConsoleColor.js');
var GetMacAdres = require(fileLocation+'/scripts/GetMacAdres.js');

//configure
bittrex.options(autoConfig.bittrexOptions());

//Time reload
setInterval(function() {
	
    //Request balance
    bittrex.getbalances( function( totaal_balance ) {
        
        //raw_data
        var data = totaal_balance;
        
        if(data.success == false){
            console.error(ConsoleColor.error()+"Er is een probleem om bittrex balance op te vragen.");
        } else {
            //memorydatabase
            var memoryDB = [];
            
            var raw_data = totaal_balance.result;
            
            //Run update balance software
            var i = 0;
            for (i = 0; i < raw_data.length; i++) {

                //scrap data
                var data = JSON.stringify({
                    coin: raw_data[i].Currency,
                    balance: raw_data[i].Balance,
                    available: raw_data[i].Available,
                    pending: raw_data[i].Pending,
                    exhange: 'bittrex'
                });

                memoryDB.push(data);
            }
            
            // Set the headers
            var headers = {
                'User-Agent': 'Super Agent/0.0.1',
                'Content-Type': 'application/x-www-form-urlencoded'
            };
            
            //voeg data samen
            var exportData = {
                mac: GetMacAdres.getMacAdres(),
                balanceData: memoryDB
            };
            
            // Configure the request
            var options = {
                url: autoConfig.serverURL()+'/api/updatebalance',
                method: 'POST',
                headers: headers,
                form: exportData
            };
            
            // Start the request
            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log("body "+body);
                } else{
                    console.log("error "+error);
                }
            });
        } 
    });
}, 60000);