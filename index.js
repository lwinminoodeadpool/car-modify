'use strict';

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  request = require('request'),
  requestify = require('requestify'),
  app = express().use(bodyParser.json()); // creates express http server

  const pageaccesstoken = 'EAAhuvKStHYYBAOHm6Vs1W8z7cJEpENZAd7CikWpIyHz5Nw1BbT9juT8sLqbdZCwlaINPxC51HPE3eZAuHZCSkIi6nXI7lVdQCUovw5pRjRZCUcAviaevVNAMXh0bQsEtkdzDJmfHY8GEnM2rfy3Car1ihPhu59w0XrvOJQXxKTIS0JsbJvXU8'
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
          console.log('within Hi')
          let welcomeMessage = {
            "recipient":{
              "id":webhook_event.sender.id
            },
            "message":{
              "text":"hello, world!"
            }
          };

          let genericMessage = {
            "recipient":{
              "id":webhook_event.sender.id
            },
            "message":{
              "attachment":{
                "type":"template",
                "payload":{
                  "template_type":"generic",
                  "elements":[
                    {
                      "title":"Titanic",
                      "image_url":"data:image/jpeg;base64,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",
                      "subtitle":"Sinking please help!",
                      "buttons":[
                        {
                          "type": "postback",
                          "title": "Help that motherfucker",
                          "payload": "Help"
                        },
                        {
                          "type": "postback",
                          "title": "Let it sink",
                          "payload": "Sink"
                        }
                      ]      
                    },
                    {
                      "title":"Hello",
                      "image_url":"https://i.ytimg.com/vi/JilHZ_DdBYg/maxresdefault.jpg",
                      "subtitle":"Hi",                      
                      "buttons":[
                        {
                          "type": "postback",
                          "title": "who cares",
                          "payload": "ok"
                        },
                        {
                          "type": "postback",
                          "title": "hello",
                          "payload": "hello"
                        }
                      ]      
                    }
                  ] 
                }
              }
            }
          }

          requestify.post(`https://graph.facebook.com/v3.3/me/messages?access_token=${pageaccesstoken}`, {
            welcomeMessage
          }).then( response => {
            console.log(response)
          }).fail( error => {
            console.log(error)
          })

          requestify.post(`https://graph.facebook.com/v3.3/me/messages?access_token=${pageaccesstoken}`, {
            genericMessage
          }).then( response => {
            console.log(response)
          }).fail( error => {
            console.log(error)
          })

          /*request({
            url:     `https://graph.facebook.com/v3.3/me/messages?access_token=${pageaccesstoken}`,
            method: 'POST',
            json: welcomeMessage
          }, function(error, response, body){
            console.log('welcomeMessage: ',body);
          });

          request({
            url:     `https://graph.facebook.com/v3.3/me/messages?access_token=${pageaccesstoken}`,
            method: 'POST',
            json: genericMessage
          }, function(error, response, body){
            console.log('genericMessage: ', body);
          });*/
        
        }
      });
  
      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  
  });