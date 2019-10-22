'use strict';

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  requestify = require('requestify'),
  app = express().use(bodyParser.json()); // creates express http server

  const pageaccesstoken = 'EAAhuvKStHYYBAFXWPhJgUuEwHCovYF7LzBiuZAa2BMT2ijS44fkqZBvZBUhLZBU7GmTZCvpEz6F1Qz0xMSEj0AOuHp4owr8StVVYoylQQzkQlkxZBeT2hMaU2Q0epMilPMXWRwZBHuHhUrIhiJKVzXFqZCsZBaDEoZBtv6zGT1zgR0bwDIUoZByt6Wj'
// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = "2373556309400966"
      
    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
      
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
    
      // Checks the mode and token sent is correct
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        
        // Responds with the challenge token from the request
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
      
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);      
      }
    }
  });

// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {  
 
    let body = req.body;
  
    // Checks this is an event from a page subscription
    if (body.object === 'page') {
  
      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {
  
        // Gets the message. entry.messaging is an array, but 
        // will only ever contain one message, so we get index 0
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);
        var userInput = webhook_event.message.text;

        if (userInput == 'Hi'){
            requestify.post('https://graph.facebook.com/v4.0/me/messages?access_token='+pageaccesstoken,
            {
                "recipient":{
                    "id": webhook_event.sender.id
                },
                "message":{
                    "attachment":{
                        "type":"template",
                        "payload": {
                        "template_type":"button",
                        "text":"Hello",
                        "buttons":[{
                            "type":"postback",
                            "title":"next stage",
                            "payload":"something"
                        }]
                        }
                    }
                }
            }).then( success => {
              console.log(success)
            }).then( error => {
              console.log(error)
            })
        }
      });
  
      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  
  });