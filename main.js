//load modules
var express = require('express');

//load codes
var consoleColors = require('./consoleCorlor');

//app
var app = express();

//start server
app.listen(8090, function(){
    console.log(consoleColors.log()+"Server is opgestart.");
});