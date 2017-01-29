//load modules
var request = require('request');
var fs = require('fs');

//load bittrex
var bittrex = require('./node.bittrex.api/node.bittrex.api.js');

//config
var autoConfig = JSON.parse(fs.readFileSync("./autoConfig.json"));
var config = JSON.parse(fs.readFileSync("./config.json"));

//configure
bittrex.options({
    'apikey' : config.bittrex.apiKey,
    'apisecret' : config.bittrex.apiSecretKey,
    'stream' : true,
    'verbose' : false,
    'cleartext' : false
});

//Time reload
//setInterval(function() {
	
    //Request balance
    bittrex.getbalances( function( totaal_balance ) {
        
        //raw_data
        var data = totaal_balance;
        
        if(data.success == false){
            console.error(consoleColors.error()+"Er is een probleem om bittrex balance op te vragen.");
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
            console.log(memoryDB);
            
            // Set the headers
            var headers = {
                'User-Agent': 'Super Agent/0.0.1',
                'Content-Type': 'application/x-www-form-urlencoded'
            };
            
            // Configure the request
            // http://'+config.hostConnection.ip+':'+config.hostConnection.poort+'/api/updatebalance
            var options = {
                url: 'http://192.168.31.130:8080/api/updatebalance',
                method: 'POST',
                headers: headers,
                form: memoryDB
            };

            // Start the request
            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body);
                } else{
                    console.log(error);
                }
            });   
        } 
    });
//}, 60000);

