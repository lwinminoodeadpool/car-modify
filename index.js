'use strict';

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  requestify = require('requestify'),
  app = express().use(bodyParser.json()); // creates express http server

  const pageaccesstoken = 'EAAhuvKStHYYBAB6xCd06CQv7o6JgO1crGRQKyhPLvUEsRfZAl0WUnHthOUO6gFs8E9fPyxtNZCRC5EbHZB8RTLkf20VRBE23WZC3rxOE3DGGYR0hKdh37zGOfTFZA4FG5eOkGYw6TYIg9gFeBBieuSMn32GzU6X43N5gztiCSh5HT2ICHrHg9'

  requestify.post(`https://graph.facebook.com/v2.6/me/messenger_profile?access_token=${pageaccesstoken}`, 
  {
    "get_started": {
      "payload": "Hi"
    },
    "greeting": [
      {
        "locale":"default",
        "text":"Hello {{user_first_name}}!" 
      }, {
        "locale":"en_US",
        "text":"Timeless apparel for the masses."
      }
    ]
  }
).then( response => {
  console.log(response)
}).fail( error => {
  console.log(error)
})

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
        if(webhook_event.message){
          var userInput = webhook_event.message.text
        }
        if(webhook_event.postback){
          var userButton = webhook_event.postback.payload
        }
        
        if (userInput == 'Hi' || userButton == 'Hi' ){
          let welcomeMessage = {
            "recipient":{
              "id":webhook_event.sender.id
            },
            "message":{
              "text":"Hello, Welcome to Curious Wheel!"
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
                    {// start of car beautify 
                      "title":"Car Beautify",
                      "subtitle":"Suggection for car beautify",
                      "image_url":"http://www.myanmarcarmarketplace.com/oc-content/uploads/0/315_preview.jpg",
                      "buttons":[
                        {
                          "type": "postback",
                          "title": "car body kit",
                          "payload": "bodykit"
                        },
                        {
                          "type": "postback",
                          "title": "Car interior",
                          "payload": "interior"
                        }
                      ]      
                    },
                    //end of beautify 
                    //start of performance build and drift build
                    {
                      "title":"Performance Build",
                      "image_url":"https://www.drivemyanmar.com/wp-content/uploads/2017/12/car-drift3.jpg",
                      "subtitle":"Performance build suggection",                      
                      "buttons":[
                        {
                          "type": "postback",
                          "title": "Performance build",
                          "payload": "performance"
                        },
                        {
                          "type": "postback",
                          "title": "Drift build",
                          "payload": "drift"
                        }
                      ]      
                    },
                    //end of car performance build and drif build 
                    //start of car parts trade
                    {
                      "title":"Car part trade",
                      "image_url":"http://nic.trade/img/trade.png",
                      "subtitle":"car part trade for same car part",                      
                      "buttons":[
                        {
                          "type": "postback",
                          "title": "Car part trade",
                          "payload": "Trade"
                        }
                      ]      
                    }
                    //end of car part trade
                  ] 
                }
              }
            }
          }

          requestify.post(`https://graph.facebook.com/v3.3/me/messages?access_token=${pageaccesstoken}`, 
            welcomeMessage
          ).then( response => {
            console.log(response)
          }).fail( error => {
            console.log(error)
          })

          requestify.post(`https://graph.facebook.com/v3.3/me/messages?access_token=${pageaccesstoken}`, 
            genericMessage
          ).then( response => {
            console.log(response)
          }).fail( error => {
            console.log(error)
          })
        
        }
          //body kit 
        if(userButton == 'bodykit'){
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
                      "title":"please choose one.",
                      "buttons":[
                        {
                          "type": "postback",
                          "title": "popular carbody kit",
                          "payload": "pkt"
                        },
                        {
                          "type": "postback",
                          "title": "Car bodykit shops",
                          "payload": "cbs"
                        }
                      ]      
                    }
                  ] 
                }
              }
            }
          }


          requestify.post(`https://graph.facebook.com/v3.3/me/messages?access_token=${pageaccesstoken}`, 
            genericMessage
          ).then( response => {
            console.log(response)
          }).fail( error => {
            console.log(error)
          })
        }
        //end of car body kit and choose one 

        //star of choose one user said popular carbody kit 

        if(userButton == 'pkt'){
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
                      "title":"please choose your car brand .",
                      "buttons":[
                        {
                          "type": "postback",
                          "title": "Toyota",
                          "payload": "ty"
                        },
                        {
                          "type": "postback",
                          "title": "Nissan",
                          "payload": "ns"
                        },
                        {

                          "type": "postback",
                          "title":"Suzuki",
                          "payload":"sz"
                        }
                      ]      
                    }
                  ] 
                }
              }
            }
          }


          requestify.post(`https://graph.facebook.com/v3.3/me/messages?access_token=${pageaccesstoken}`, 
            genericMessage
          ).then( response => {
            console.log(response)
          }).fail( error => {
            console.log(error)
          })
        }
        //end of popular carbody kit 

      });
  
      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  
  });