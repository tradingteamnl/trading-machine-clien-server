//load modules
var fs = require('fs');
var ConsoleColor = require('./ConsoleColor.js');

//fileLocationInstall
function fileLocationInstall(){
    
    //dir path
    var dir = __dirname+'/temp';

    //kijk of folder bestaat
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    
    //save file location
    fs.writeFile("./temp/fileLocation.txt", JSON.stringify({
        file: __dirname,
        fileLocation: __dirname
    }));
}

/* ==================== GETTER ====================  */
exports.fileLocationInstall = function(){
    fileLocationInstall();
    console.log(ConsoleColor.log()+"Filelocation.txt aangemaakt.");
};