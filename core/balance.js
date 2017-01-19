//load modules
var async = require('async');
var fs = require('fs');

//load bittrex
var bittrex = require('./node.bittrex.api/node.bittrex.api.js');

//balance
var balance = {};

//config
var autoConfig = JSON.parse(fs.readFileSync("./autoConfig.json"));
var config = JSON.parse(fs.readFileSync("./config.json"));

//configure
bittrex.options({
		'apikey' : 'a44647f1dc9946b9b85bf3ed9018da42',
		'apisecret' : '7cdb26fc6cab414aa3cac41ce5ed4550',
		'stream' : true,
		'verbose' : false,
		'cleartext' : false
});

//Load db
//var database = jsonfile.readFileSync("./conf/auto_conf/balance_db.json");

//Time reload
//setInterval(function() {
	
	//Request balance
	bittrex.getbalances( function( totaal_balance ) {
	
		//Make json var
		var raw_data = totaal_balance.result;
	
		//Run save software
		var i = 0;
		for (i = 0; i < raw_data.length; i++) {
	
			//scrap data
			var data = JSON.stringify({
				balance: raw_data[i].Balance,
				available: raw_data[i].Available,
				pending: raw_data[i].Pending
			});
		
			//Name
			var coin_name = raw_data[i].Currency;
                        console.log(coin_name);
			
		} 
	});
//}, 60000);

/*
//bittrex
bittrex.options({
    baseUrl: autoConfig.bittrex.url,
    apikey: config.bittrex.apiKey,
    apisecret: config.bittrex.apiSecretKey,
    verbose: autoConfig.bittrex.verbose,
    cleartext: autoConfig.bittrex.cleartext,
    stream: autoConfig.bittrex.stream
});


//request bittrex balance
function bittrexGetBalance(){
    
    //Request balance
    console.log("test");
    bittrex.getbalance(function(totaal_balance) {
        
        console.log(totaal_balance);
        var bittrexBalance = JSON.parse(totaal_balance).result;
        
        //bittrex memory
        var bittrexMemory = {};
        
        //for loop
        for (i = 0; i < bittrexBalance.length; i++) { 
            var data = {
                "Balance" : bittrexBalance.Balance,
                "Available" : bittrexBalance.Available,
                "Pending" : bittrexBalance.Pending
            };
            bittrexMemory[bittrexBalance[i].Currentie] = data;
        }
        
        balance[bittrex] = bittrexMemory;
        wait();
    
    });	
}


//wait function
function wait(){
    console.log(balance);
}

bittrexGetBalance();*/