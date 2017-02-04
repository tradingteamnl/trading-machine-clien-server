//load modules
var fs = require('fs');
var installer = require('./Installer.js');
var ConsoleColor = require('./ConsoleColor.js');

//kijk of location file bestaat
fs.exists('./temp/fileLocation.txt',function(exists){
    if(!exists){
        installer.fileLocationInstall();
    }
});

//wacht 2 minuten zodat alles netjes aangemaakt kan worden
setTimeout(function(){
    console.log(ConsoleColor.log()+"Installer is compleet.");
    require('./Client.js');
}, 10000);