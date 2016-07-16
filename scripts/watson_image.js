var watson = require('watson-developer-cloud');

var alchemy_vision = watson.alchemy_vision
({
  api_key: '9908391a4c1a215d4439bed414a8597a867632da'
});

var v_apiKey = 'cf61b89ce3e0a56602f9e89d64a72b11dff56fb5';

var visual_recognition = watson.visual_recognition
({
  url: 'https://gateway-a.watsonplatform.net/visual-recognition/api',
  api_key: v_apiKey,
  version: 'v3',
  version_date: '2016-05-19'
});

module.exports = function()
{
  this.w_image = function(path, callback)
  {
    var fs = require('fs');

    var params =
    {
      image: fs.createReadStream(path)
    }

    var result;

    alchemy_vision.getImageKeywords(params, function (err, keywords)
    {
      if (err)
        result = err;
      else
        result = keywords;
      callback(result, path, true);
    });
  }

  this.classify = function(path, classID, owner, callback)
  {

    console.log('Classifying image');

    var fs = require('fs');

    var params =
    {
      classifier_ids: [classID],
      owners: [owner],
      threshold: 0.2,
      images_file: fs.createReadStream(path),
    }

    var result;

    visual_recognition.classify(params, function(err, res)
    {
    if (err)
      result = err;
    else
      result = JSON.stringify(res, null, 2);
    callback(result);
    });
  }

/*
  this.updateClassifier = function(path, positive, negative, classID, callback)
  {

    var fs = require('fs');
    var request = require('request');
    classID = "dogs_360054925";
    var u = "https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classifiers{" + classID  + "}?api_key={" + v_apiKey + "}&version=2016-05-20";
    var data =
    {
      dalmation_postive_examples: fs.createReadStream('./dalmation.zip'),
      negative_examples: fs.createReadStream('./more-cats.zip')
    }
  //  var needle = require('needle');
  //  needle.post(u, data,
 //   function(err, resp, body){
 //       console.log(body);
 //});

    var options = {
        method: 'POST',
        url: "https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classifiers/{dogs_360054925}?api_key={cf61b89ce3e0a56602f9e89d64a72b11dff56fb5}&version=2016-05-20",
        headers: {
            'Content-Type': 'application/json'
        },
        json: data
    };

    console.log(options);

    request(options, function(error,response,body)
    {
      if (!error)
      {
        var info = JSON.parse(JSON.stringify(body));
        console.log(info);
      }
      else
      {
        console.log('Error happened: '+ error);
      }
    });

  };
*/
  this.buildClassifier = function(positive, negative, callback)
  {

    console.log('Building classifier!');

    var fs = require('fs');

    var params =
    {
      beagle_positive_examples: fs.createReadStream('./beagle.zip'),
      husky_positive_examples: fs.createReadStream('./husky.zip'),
      goldenretriever_positive_examples: fs.createReadStream('./golden-retriever.zip'),
      negative_examples: fs.createReadStream('./cats.zip'),
      name: "dogs"
    }

    var result;

    visual_recognition.createClassifier(params, function(err, res)
    {

    if (err)
      result = err;
    else
      result = JSON.stringify(res, null, 2);

    callback(result);
    });

  }

}
