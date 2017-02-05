//load modules
var express = require('express');

//load codes
var consoleColors = require('./ConsoleCorlor.js');

//app
var app = express();

//load bittrex
require('./core/balance.js');

//start server
app.listen(8090, function(){
    console.log(consoleColors.log()+"Server is opgestart.");
});