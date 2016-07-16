var watson = require('watson-developer-cloud');

var alchemy_vision = watson.alchemy_vision
({
  api_key: '9908391a4c1a215d4439bed414a8597a867632da'
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
}
