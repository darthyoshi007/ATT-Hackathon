var watson = require('watson-developer-cloud');
var fs = require('fs');
var alchemy_language = watson.alchemy_language({
  api_key: '9908391a4c1a215d4439bed414a8597a867632da'
});

module.exports = function()
{
  this.w_text = function(pathString, docConvert, callback) {
    var content;
    console.log('hey bish');
    // fs.readFile(pathString, 'utf8', function read(err, data){
    //   if (err) {
    //     throw err;
    //   }
    //   content = data
    //   giveMeTheMoney();
    // });
    if(!docConvert){
      fs.readFile(pathString, 'utf8', function read(err, data){
        if (err) {
          console.log("error: not supported file");
        }
        content = {
          text: data
        }
        sendToWatson();
      });
    }
    else{
      giveMeTheMoney();
    }

    function giveMeTheMoney(){

      var document_conversion = watson.document_conversion({
        username: '6afbd787-ebf4-46be-9465-cdff40d1c7c2',
        password: 'mjiMzXRpu44l',
        version: 'v1',
        version_date: '2015-12-01'
      });

      // convert a single document
      document_conversion.convert({
        // (JSON) ANSWER_UNITS, NORMALIZED_HTML, or NORMALIZED_TEXT
        file: fs.createReadStream(pathString),
        conversion_target: document_conversion.conversion_target.NORMALIZED_TEXT,
        config: {
          // split the html file by "h2", "h3" and "h4" tags
          html_to_answer_units: {
            selectors: [ 'h2','h3', 'h4']
          }
        }
      }, function (err, response) {
        console.log("----------\n");
        console.log("convert a single document\n");
        console.log("----------\n");
        if (err) {
          console.error(err);
        } else {
          // console.log(JSON.stringify(response, null, 2));
          // content = JSON.stringify(response, null, 2).trim();
          // console.log(content);
          // content = response.replace(/\n/g, " ").trim();
          content = {
            text: response.replace(/\n/g, " ").trim()
          }
          // console.log(response);
          sendToWatson();
        }
      });
    }

    function sendToWatson(){
      alchemy_language.combined(content, function (err, response) {
        if (err)
          console.log('error: ', err);
        else
          //console.log(JSON.stringify(response, null, 2));
          callback(response, pathString, false);
      });
      //content = JSON.stringify(response, null, 2);
    }

  };
}





  // function giveMeTheShit(content){
  //   console.log(content);
  //   return content;
  // }
