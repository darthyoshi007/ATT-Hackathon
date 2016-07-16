var watson = require('watson-developer-cloud');
var chokidar = require('chokidar');
var mv = require('mv');
require('./watson_image.js')();
log();
var watcher = chokidar.watch('/Users/jakob/Downloads', {
  ignored: /[\/\\]\./,
  persistent: true,
  depth: 0
});

var alchemy_language = watson.alchemy_language({
  api_key: '9908391a4c1a215d4439bed414a8597a867632da'
});


var params = {
  text: 'The quick brown fox jumped over the lazy panda. Vanguard is a good bank.'
};

alchemy_language.combined(params, function (err, response) {
  if (err)
    console.log('error: ', err);
  else
    console.log(JSON.stringify(response, null, 2));
});


watcher.on('all', (event, path) => {
  console.log("Event: " + event + " | Path: " + path);
  var arr = path.split('.');
  if (event == "add" && arr[arr.length - 1] == "pdf"){
    console.log(path + " is a pdf. Moving to Documents Folder");
    var movePath = path.split('\\');
    mv(path, '/Users/jakob/Documents/' + movePath[movePath.length - 1], {mkdirp: true}, function(err) {
      if (err){
        console.log(err);
      }
    });
  }

});
