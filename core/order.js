/**
 * Note
 * Order.js werkt bij bittrex alleen van BTC naar andere cryptocoin
 * Getorderbook support alleen van BTC naar andere cryptocoin
 * 
 */


//load modules
var fs = require('fs');
var request = require('request');

//laat filelocation
var fileLocation = JSON.parse(fs.readFileSync("./temp/fileLocation.txt")).fileLocation;

//laat config
var config = JSON.parse(fs.readFileSync(fileLocation + "/config.json"));

//laat andere script codes
var ConsoleColor = require(fileLocation + '/ConsoleColor.js');
var bittrex = require(fileLocation + '/core/node.bittrex.api/node.bittrex.api.js');
var GetMacAdres = require(fileLocation + '/scripts/getMacAdres');
var ConfigGetter = require(fileLocation + '/configGetter.js');

//vraag alle order settings op
var settingOrdersBittrex = config.orders.bittrex;
var settingOrdersPoloniex = config.orders.poloniex;

//get balance
getBalance();

//function vraag balance data op
function getBalance() {
    // Set the headers
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    // Configure the request
    var options = {
        url: ConfigGetter.serverURL() + '/api/getbalance',
        method: 'POST',
        headers: headers,
        form: {macadres: GetMacAdres.getMacAdres()}
    };

    // Start the request
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            //great json object
            var dataObject = JSON.parse(body);

            //balance data verwerken naar iets bruikbaars
            var balanceData = {};

            //kijk welke exchange het is
            if (config.getbalance.bittrex == true) {

                //push naar memory db
                balanceData['bittrex'] = dataObject.bittrex;

                console.log(ConsoleColor.log() + "De balance hoeveelheid van bittrex is verwerkt.");
            } else {
                console.log(ConsoleColor.log() + "Er hoeft gaan balance data omgezet te worden.");
            }

            makesqlRequest(balanceData);
        } else {
            console.log(ConsoleColor.error() + "Er is een probleem om de balance data bij de server op te vragen.");
            console.log(ConsoleColor.error() + "Dit probleem doet zich voor bij order.js");
        }
    });
}

//get orders settings
function makesqlRequest(balanceData) {

    //memory db
    var sendOpdracht = [];

    /**
     * Hier word even na gekijken of order true is. Als het false is word de orders niet opgevraagd bij de server
     * 
     * @param Bittrex
     * @param Poloniex moet nog verder word ontwikkeld
     */
    if (config.orders.bittrex == true) {

        //laat bittrex api key
        bittrex.options(ConfigGetter.bittrexOptions());

        sendOpdracht.push({'bittrex': config.orders.bittrex});
    }

    /*if(config.orders.poloniex == true){
     
     //laat bittrex api key
     bittrex.options(autoConfig.bittrexOptions());
     
     sendOpdracht.push({'bittrex': config.orders.bittrex});
     }
     */
    sendDataNaarDeServer(sendOpdracht, balanceData);
}

//request
function sendDataNaarDeServer(sendOpdracht, balanceData) {

    // Set the headers
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    // Configure the request
    var options = {
        url: ConfigGetter.serverURL() + '/api/getorder',
        method: 'POST',
        headers: headers,
        form: sendOpdracht
    };

    // Start the request
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //hier word even gekeken of er zinnige data is terug gekomen.
            if (body.length > 5) {
                //json.parse
                var data = JSON.parse(body);
                console.log("data.length " + data.length);
                console.log("data" + data);
                //send data door naar makeOrder function
                for (i = 0; i < data.length; i++) {

                    //hier laat het systeem de buy kant
                    if (data[i].markttype == "buy") {

                        var exportMemory = {
                            //maak een variable
                            id: data[i].id,
                            handelsplaats: data[i].handelsplaats,
                            coin: (data[i].coin).toUpperCase()
                            , markttype: data[i].markttype,
                            prioriteit: data[i].prioriteit,
                            prijs: data[i].prijs,
                            hoeveelheid: data[i].hoeveelheid,
                            markt: data[i].markt,
                            maxCoinOnBalance: data[i].limiet,
                            besteprijs: data[i].besteprijs
                        };

                        var orderData = exportMemory;
                    }

                    //hier laat het systeem de sell kant
                    if (data[i].markttype == "sell") {

                        var exportMemory = {
                            //maak een variable
                            id: data[i].id,
                            handelsplaats: data[i].handelsplaats,
                            coin: (data[i].coin).toUpperCase(),
                            markttype: data[i].markttype,
                            prioriteit: data[i].prioriteit,
                            prijs: data[i].prijs,
                            hoeveelheid: data[i].hoeveelheid,
                            markt: data[i].markt,
                            minimaleCoinBehouden: data[i].limiet,
                            besteprijs: data[i].besteprijs
                        };

                        var orderData = exportMemory;
                    }
                    //ga door naar de dataVerwerken functino
                    console.log("dataverwerken");
                    dataVerwerken(balanceData, orderData, i);
                }
            } else {
                console.log(ConsoleColor.warn() + "Er is geen order data terug gekomen.");
            }
        } else {
            console.error(ConsoleColor.error() + "Er is een probleem om de sql te sturen naar de server. Probleem bij order.js.");
        }
    });
}

//verwerkt data
function dataVerwerken(balanceData, orderData, i) {

    /**
     * balanceData[orderData.handelsplaats][(orderData.coin).toUpperCase()]
     * deze string gaat naar de balance van de geselecteerde handels plaats
     * orderData.coin selecteerd de coin die gekockt moet worden
     * toUppercase is om er een hoofdletters van te maken zodat de coin uit de balance kan selecter
     */
    var GetBalanceString = balanceData[orderData.handelsplaats][(orderData.coin).toUpperCase()].balance;
    var GetBalanceBtc = balanceData[orderData.handelsplaats]['BTC'].available;

    /**
     * Als type order is buy en als
     * oderData.maxCoinsOnBalance > GgetBalanceString dit command is om
     * te kijken of er ruimte is om coins bij te kopen dan is if loop true dus
     * word de loop uitgevoerd.
     */

    console.log(orderData.maxCoinOnBalance);
    console.log(GetBalanceString);

    if (orderData.markttype == "buy" && orderData.maxCoinOnBalance > GetBalanceString) {

        console.log("getbalance " + GetBalanceString);
        console.log("max balance " + orderData.maxCoinOnBalance);

        //bereken het verschil tussen de maximale hoeveelheid en de huidige balance
        var verschilInBalance = orderData.maxCoinOnBalance - GetBalanceString;
        console.log("code is en buy afdeling");

        /**
         * als besterpijs = 0 dan pak die prijs uit het database
         * als besteprijs = 5 reken dan uit 
         */

        //als beste prijs 0 is
        if (orderData.besteprijs == 0) {

            //Bereken prijs met fees
            var prijsMetFees = orderData.prijs * ConfigGetter.bittrexFees();

            //bereken of btc belance toe rijkende is
            if (prijsMetFees * verschilInBalance < GetBalanceBtc) {
                console.log("btc balance is grote dan wat er aangekockt moet worden")
                /**
                 * Zorg dat de variable gevuld woden
                 * 
                 * variabele quantity = verschilInBalance
                 * variabele prijs. Dat is met fees = prijsMetFees
                 * marketType is nu voor btc en andere coin. Het is het hoofdletters geschreven
                 */
                var quantity = verschilInBalance;
                var prijs = prijsMetFees;
                var marketType = "BTC-" + (orderData.coin).toUpperCase();

                //als de order boven de  0.00050000 BTC komt dan run anders niet
                if (quantity * prijsMetFees > 0.00050000) {
                    SetOrderForBuyLimit(prijs, quantity, marketType);
                }
            }

            if (prijsMetFees * verschilInBalance > GetBalanceBtc) {

                /**
                 * Bereken hoeveel coins er maximaal kunnen worden aagekockt
                 * GetBalanceBtc / prijsMetFees;
                 * variabele prijs. Dat is met fees = prijsMetFees
                 * marketType is nu voor btc en andere coin. Het is het hoofdletters geschreven
                 */

                var quantity = GetBalanceBtc / prijsMetFees;
                var prijs = prijsMetFees;
                var marketType = "BTC-" + (orderData.coin).toUpperCase();

                //als de order boven de  0.00050000 BTC komt dan run anders niet
                if (quantity * prijsMetFees > "0.00050000") {
                    SetOrderForBuyLimit(prijs, quantity, marketType);
                }
            }
        }

        //als beste prijs 5 is
        if (orderData.besteprijs == 5) {
            besteprijs(orderData);
        }
    }


    /**
     * Kijk of er mee balance available is dan dat er vast gehouden moet worden
     * De volgende is om de balance data van de coin op te vragen
     * var GetBalanceString = balanceData[orderData.handelsplaats][orderData.coin].available
     **/
    var GetBalanceString = balanceData[orderData.handelsplaats][orderData.coin].available;
    if (orderData.markttype == "sell" && orderData.minimaleCoinBehouden < GetBalanceString) {

        //bereken hoeveelheid die te koop moet worden aangeboden
        var quantity = GetBalanceString - orderData.minimaleCoinBehouden;
        var prijs = orderData.prijs;
        var marketType = "BTC-" + orderData.coin;

        //als de order boven de  0.00050000 BTC komt dan run anders niet
        if (quantity * prijs > "0.00050000") {
            //roep SetOrderForSelllLimit op
            SetOrderForSellLimit(prijs, quantity, marketType);
        }
    }
}
//functie op uittereken wat de beste prijs is voor het moment
/*function besteprijs(orderData) {
 var Getoptions = {
 url: 'https://bittrex.com/api/v1.1/public/getorderbook?market=BTC-' + orderData.coin + '&type=both',
 headers: {
 'User-Agent': 'request'
 }
 };
 
 function callback(error, response, body) {
 if (!error && response.statusCode == 200) {
 var data = JSON.parse(body);
 }
 }
 
 request(Getoptions, callback);
 }*/

/**
 * 
 * @param prijs
 * @param quantity
 * @param marketType
 */
function SetOrderForBuyLimit(prijs, quantity, marketType) {

    /**
     * market bijvoorbeeld (ex: BTC-LTC)
     * quantity the amount to purchase
     * rate de prijs
     */
    //make order
    bittrex.buylimit({market: marketType, quantity: quantity, rate: prijs}, function (data) {
        console.log(data);
    });
}

/**
 * 
 * @param prijs
 * @param quantity
 * @param marketType bijvoorbeeld BTC-LTC
 */
function SetOrderForSellLimit(prijs, quantity, marketType) {

    /**
     * market bijvoorbeeld (ex: BTC-LTC)
     * quantity the amount to sell
     * rate de prijs
     */
    //make order
    bittrex.selllimit({market: marketType, quantity: quantity, rate: prijs}, function (data) {
        console.log(data);
    });
}



//stuur trade id naar de server
function tradeID() {

    //headers
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    // Configure the request
    var options = {
        url: ConfigGetter.serverURL() + '/api/ordersystem/postorderid',
        method: 'POST',
        headers: headers,
        form: {macadres: GetMacAdres.getMacAdres()}
    };

    // Start the request
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            //great json object
            var dataObject = JSON.parse(body);

            //balance data verwerken naar iets bruikbaars
            var balanceData = {};

            //kijk welke exchange het is
            if (config.getbalance.bittrex == true) {

                //push naar memory db
                balanceData['bittrex'] = dataObject.bittrex;

                console.log(ConsoleColor.log() + "De balance hoeveelheid van bittrex is verwerkt.");
            } else {
                console.log(ConsoleColor.log() + "Er hoeft gaan balance data omgezet te worden.");
            }

            makesqlRequest(balanceData);
        } else {
            console.log(ConsoleColor.error() + "Er is een probleem om de balance data bij de server op te vragen.");
            console.log(ConsoleColor.error() + "Dit probleem doet zich voor bij order.js");
        }
    });
}

//geef in de terminal aan dat order.js beschikbaar is
console.log(ConsoleColor.log() + "Order.js is opgestart.");