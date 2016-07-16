var watson = require('watson-developer-cloud');

var alchemy_language = watson.alchemy_language({
  api_key: '9908391a4c1a215d4439bed414a8597a867632da'
});

var params = {
  text: 'The quick brown fox jumped over the lazy panda.'
};

alchemy_language.sentiment(params, function (err, response) {
  if (err)
    console.log('error:', err);
  else
    console.log(JSON.stringify(response, null, 2));
});
