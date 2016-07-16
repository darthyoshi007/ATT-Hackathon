const electron = require('electron');
// Module to control application life.
const {app} = electron;
// Module to create native browser window.
const {BrowserWindow} = electron;

let win;

app.on('ready', function() {
    win = new BrowserWindow({
        height: 600,
        width: 800
    });

    win.loadURL(`file://${__dirname}/../html/index.html`);
});

var path = require('path');
var fs = require('fs');
var userName = process.env['USERPROFILE'].split(path.sep)[2];
var watson = require('watson-developer-cloud');
var chokidar = require('chokidar');
var mv = require('mv');
var exec = require('child_process').exec;
var firebase = require('firebase');
const notifier = require('node-notifier');

//if true, the program will print logs based on JSON received from watson API
var debug = false;

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
//called upon any 'add' event -- any file moved to or downloaded to the Downloads folder
watcher.on('all', (event, pathToFile) => {
  if (event == "add"){
    if (debug){
      console.log("Event: " + event + " | Path: " + pathToFile.toString()); //logs the different events and files for debugging purposes
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
        w_image(pathToFile.toString(), moveFile);
        break;

      //if a file that can be parsed by watson document convertor, send to watson text with parameter of true
      case "html":
      case "doc":
      case "docx":
      case "pdf":
        w_text(pathToFile.toString(), true, moveFile);
        break;

      //if a file is audio, send to Music folder
      case "wav":
      case "mp3":
      case "m4a":
      case "wma":
      case "ogg":
        moveFile("Music", pathToFile.toString(), false); //move to OrganizEZ/Music
        break;

      //if a file is video
      case "mp4":
      case "avi":
      case "mov":
      case "avchd":
      case "flv":
      case "wmv":
      case "mpeg":
        moveFile("Video", pathToFile.toString(), false); //move to OrganizEZ/Videos
        break;

      //if a file is an installer
      case "exe":
      case "msi":
        moveFile("Installer", pathToFile.toString(), false);
      //if a file that I have no specified, send to watson text but parse using native node fs.readfile
      default:
        // if (debug){
        //   w_text(pathToFile, false, printJson);
        // }
        break;
    }
  }
});


//prints out the json to debug
var printJson = function(result){
    console.log(result);
}
// classify('foo',printJson);


firebase.initializeApp({
  databaseURL: "https://organizez-6db68.firebaseio.com",
  serviceAccount: "./scripts/OrganizEZ-40571963ddd7.json"
});
var db = firebase.database();
var moveRef = db.ref("moveActions");

var moveFile = function(result, pathToFile, image){
  if (debug){
    printJson(result);
  }

  //gets the fileName
  var fileName = pathToFile.toString().split('\\');

  //moves the file to the appropriate folder
  var mostRelevantResult = "";
  var fileType = "";
  if (image){
    fileType = "Pictures";
    mostRelevantResult = result.imageKeywords[0].text;
  } else {
    if(result == "Music"){
      mostRelevantResult = "Music";
    }
    else if(result == "Video"){
      mostRelevantResult = "Videos";
    }
    else if(result == "Installer"){
      mostRelevantResult = "Installers";
    }
    else{
        fileType = "Documents";
        mostRelevantResult = result.concepts[0].text;
    }
  }
  mv(pathToFile, '/Users/' + userName + '/OrganizEZ/' + fileType + '/' + mostRelevantResult + '/' + fileName[fileName.length - 1], {mkdirp: true}, function(err) {
    if (err){
      if (debug){
        console.log(err);
      }
    } else {
      moveRef.push({
        from : pathToFile,
        to : '/Users/' + userName + '/OrganizEZ/' + mostRelevantResult + '/' + fileName[fileName.length - 1],
        image : image,
        date : Date.now(),
        fileName : fileName[fileName.length - 1]
      });
    }
    //creates a notification which can be clicked to lead to the moved file
    notifier.notify({
      'title': "OrganizEZ",
      'message': 'Moved ' + fileName[fileName.length - 1] + ' to /Users/' + userName + '/OrganizEZ/' + mostRelevantResult + '/',
      'wait': true
    });
    notifier.on('click', function (notifierObject, options) {
      var cmd = ('start /Users/' + userName + '/OrganizEZ/' + mostRelevantResult + '/').replace(/\//g, "\\");
      exec(cmd, function(error, stdout, stderr) {
        if (error){
          console.log(error);
        }
      });
    });
  });
}
