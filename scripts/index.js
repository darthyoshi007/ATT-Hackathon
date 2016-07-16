var path = require('path');
var fs = require('fs');
var userName = process.env['USERPROFILE'].split(path.sep)[2];
var watson = require('watson-developer-cloud');
var chokidar = require('chokidar');
var mv = require('mv');

//if true, the program will print logs based on JSON received from watson API
var debug = true;

///////// Watson Handling ///////////
require('./watson_image.js')();
require('./watson_text.js')();
/////////////////////////////////////

//creates a watcher to watch the user's files in the Downloads folder
var watcher = chokidar.watch('/Users/' + userName + '/Downloads', {
  ignored: /[\/\\]\./,
  persistent: true,
  depth: 0
});

//connects to watson's alchemy API
var alchemy_language = watson.alchemy_language({
  api_key: '9908391a4c1a215d4439bed414a8597a867632da'
});


//prints out the json to debug
var printJson = function(result){
  console.log(result);
}

//called upon any 'add' event -- any file moved to or downloaded to the Downloads folder
watcher.on('all', (event, pathToFile) => {

  if (debug){
    console.log("Event: " + event + " | Path: " + pathToFile); //logs the different events and files for debugging purposes
  }

  //self-explanatory -- finds extension of file from path
  var type = path.extname(pathToFile.toString()).substring(1);

  //switches based on the extension
  switch(type){

    //if an image file, send to watson image API
    case "jpeg":
    case "gif":
    case "jpg":
    case "png":
      if (debug){
        w_image(pathToFile.toString(), printJson);
      }
      break;

    //if a file that can be parsed by watson document convertor, send to watson text with parameter of true
    case "html":
    case "doc":
    case "docx":
    case "pdf":
      if (debug){
        w_text(pathToFile.toString(), true, printJson);
      }
      break;

    //if a file that I have no specified, send to watson text but parse using native node fs.readfile
    default:
      // if (debug){
      //   w_text(pathToFile, false, printJson);
      // }
      break;
  }

});

// TODO implement moving the files
// console.log(path + " is a pdf. Moving to Documents Folder");
// var movePath = path.split('\\');
// mv(path, '/Users/' + userName + '/OrganizEZ/' + movePath[movePath.length - 1], {mkdirp: true}, function(err) {
//   if (err)
//   console.log(err);
// });
