//load modules
var express = require('express');
var fs = require('fs');

//krijg filelocation
var fileLocation = JSON.parse(fs.readFileSync('./temp/fileLocation.txt', 'utf8')).fileLocation;

//load codes
var consoleColors = require(fileLocation+'/ConsoleColor.js');

//laat config
var config = JSON.parse(fs.readFileSync(fileLocation+'/config.json'));

//app
var app = express();

//load bittrex
require('./core/SetBalance.js');

//start server
app.listen(config.hostPoort.poort, function(){
    console.log(consoleColors.log()+"Server is opgestart.");
});