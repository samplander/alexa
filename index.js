var express = require("express");
var alexa = require("alexa-app");

var PORT = process.env.PORT || 8080;
var app = express();

//Git repository check
// ALWAYS setup the alexa app and attach it to express before anything else.
var alexaApp = new alexa.app("ElsHouse");

alexaApp.express({
  expressApp: app,
  //router: express.Router(),

  // verifies requests come from amazon alexa. Must be enabled for production.
  // You can disable this if you're running a dev environment and want to POST
  // things to test behavior. enabled by default.
  checkCert: false,

  // sets up a GET route when set to true. This is handy for testing in
  // development, but not recommended for production. disabled by default
  debug: true
});

// now POST calls to /test in express will be handled by the app.request() function

// from here on you can setup any other express routes or middlewares as normal
app.set("view engine", "ejs");


//This code is universal to call an api
async function getRemoteData(url){
  const client = url.startsWith('https') ? require('https') : require('http');
  const request = await client.get(url);
}


alexaApp.launch(function(request, response) {
  getRemoteData('http://remote:remote@105.208.44.88:8008/scada-remote?m=json&r=cbus1&c=set&matchnet=0&matchapp=56&matchgrp=8&value=0');
  response.say("Boooooom, study lights are now off!");
});

alexaApp.dictionary = { "names": ["matt", "joe", "bob", "bill", "mary", "jane", "dawn"] };

alexaApp.intent('NameIntent', {
  "slots": { "NAME": "LITERAL", "AGE": "NUMBER" },
  "utterances": ["{My name is|my name's} {matt|bob|bill|jake|nancy|mary|jane|NAME} and I am {1-100|AGE}{ years old|}"]
}, function(req, res) {
  res.say('Your name is ' + req.slot('NAME') + ' and you are ' + req.slot('AGE') + ' years old');
});

alexaApp.intent('AgeIntent', {
  "slots": { "AGE": "NUMBER" },
  "utterances": ["My age is {1-100|AGE}"]
}, function(req, res) {
  res.say('Your age is ' + req.slot('AGE'));
});

alexaApp.intent('SelfIntent', {
  "slots": { "NAME": "LITERAL" },
  "utterances": ["Tell about {puttareddy|NAME}"]
}, function(req, res) {
  let name = req.data.request.intent.slots.NAME.value;
  //console.log('name is -->', name)
  let obj = '';
  if (name === 'murali'){
    obj +='Murali is Adolf Hitler for 235 Bloor East kids'
  }else if(name === 'puttareddy'){
    obj +='Puttareddy is creazy boy in 235 Bloor east'
  }
  res.say(obj);
});


app.listen(PORT, () => console.log("Listening on port " + PORT + "."));
