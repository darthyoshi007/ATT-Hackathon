var watson = require('watson-developer-cloud');

var alchemy_vision = watson.alchemy_vision
({
  api_key: 'cf61b89ce3e0a56602f9e89d64a72b11dff56fb5'
});

var visual_recognition = watson.visual_recognition
({
  url: 'https://gateway-a.watsonplatform.net/visual-recognition/api',
  api_key: '',
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
        result = JSON.stringify(keywords, null, 2);
      callback(result);
    });
  }

  this.classify = function(path, callback)
  {

    console.log('Classifying image');

    var fs = require('fs');

    var params =
    {
      images_file: fs.createReadStream('./test.jpg')
    }

    var result;

    visual_recognition.classify(params, function(err, res)
    {
    console.log('Classify..')
    if (err)
      result = err;
    else
      result = JSON.stringify(res, null, 2);

    callback(result);
    });
  }
}
