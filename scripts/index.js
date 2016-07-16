var watson = require('watson-developer-cloud');
var mv = require('mv');
require('./watson_image.js')();
var alchemy_language = watson.alchemy_language({
  api_key: '9908391a4c1a215d4439bed414a8597a867632da'
});



var json = function(result){
 console.log(result);
}

image = w_image('./test.jpg',json)


