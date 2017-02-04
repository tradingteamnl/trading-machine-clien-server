//load modules
var fs = require('fs');
var ConsoleColor = require('./ConsoleColor.js');

//fileLocationInstall
function fileLocationInstall(){
    
    //save file location
    fs.writeFile("./temp/fileLocation.txt", JSON.stringify({
        file: __dirname,
        fileLocation: __dirname
    }));

    //dir path
    var dir = __dirname+'/temp';

    //kijk of folder bestaat
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
}

/* ==================== GETTER ====================  */
exports.fileLocationInstall = function(){
    fileLocationInstall();
    console.log(ConsoleColor.log()+"Filelocation.txt aangemaakt.");
};