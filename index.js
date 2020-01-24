'use strict';

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  requestify = require('requestify'),
  app = express().use(bodyParser.json()); // creates express http server

const admin = require('firebase-admin');

var serviceAccount = {
  "type": "service_account",
  "project_id": "carmodify-lmo",
  "private_key_id": "09424262e79de6032b2cdbce2a33c30360152e72",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDtoIaNvOISksLS\ntsnwKsHjpePbz7RHYco6e7m+pFD0UXkmCbNzWReryORrCllWby4sf5X4eMQXTwjy\n0pjPf2BTXzrsH1HwkLJwusth4JQXdbFh6o3FjaNHuocbLDvnqxtYE+xEC3lU7SFv\n5C9IS9fVZERLbqL2AX1C8jO6TTZ8Ga9yO/QhF4xYSpsAwzX/hxesG79eEemxE1F7\nREBcOZcjmJw9nk5zFx3HLdt0n4iW1vBEebsSrjaPKeUh/EfWbxiFmAEj92kVj9OQ\n1X/s2DB5MQ57LVXwn7LHHfGnLuGA+k49yoQLs4Isfr16cb5VpR5hbPWJfY3meVQL\ngNon6UsHAgMBAAECggEAD7ep9A8Vyae2cOHmmoGhgHwVBbwyeZ7mFZc1x9PY3PLU\nohJLMdUnQ9VjsmbQAO/AAfEly3ZldgCOyszo5En8ZkIAGjp6HNYypKfeUv4xSBn1\n89A5X2NJH7Hz73VYuFqbfOhtx2nA3+qtZwK/U+IHB9YmzvHQSphPn5F4oBktAj6U\nuNxJ6YbBMqOY/c9DO4/E+LbjNYuxURA9yCHyKdQ81CkdLR2GLlnttRwOAyfeLoyN\nkizBBsqB9t01MANT2mEKjluHTN+WcopxsDgR9JZAIrpJaLfWgnrf9o4SI+cM3sGc\nE0FNGNEg2kOS+oc0KzjMrpQ35opL0PDGMRRM9WVlzQKBgQD37TsbEZSC57okPrsY\nOkzvigw4RirDjUjb9IlIeEA29R+TCRbwMjDTb+WGsicv6CE0GWszG1KQqz0Wru1N\nkPedGn/BHRsavtnGxM4WczNcGldtc3moso8RSIDfN4s4VZsXOBqo1YebNRPvDEDz\nElspePMTVzvmRhXBzG/WmxCRSwKBgQD1XW9RDfn0G14j26MqpTBcfNGws932x/Rg\n7tBUTDRuxkVhikbcalTAh8guYVRKzJuvHPPddSp887tuow+JZvfENiA7rBjtoErF\nK+lclOz2uRVJpVkwUbfIoixj/B0THkrIECWxS1Hxux/3rONR5/rHB0UluNMhFPYL\nEJvxJv4TtQKBgQDL0CYq1oT0KHOJoFhGToc41I+/I0+8esVOrPS+srx3cYOHaI2G\n4HvrFa3m0UYNyBKjtdG+rdNuQpdxslQ609X7PPGRW9AQaJy3HssdAY9TRARjYe69\nlCyw1J284vh8U0OwDts7uG5GVZgRiE1MheaTbW7Gk4wWfb8dFmdKUSeJiQKBgEHW\nNVVJa8U9RrBWcdyygFyAvX8tdCSQmJkd21aTMAp9NwaqJMNl4KHcjTEsuoJrjmaZ\nXTISCzmF6MgSBsw2jcrfPxzj27h/JzDqzG4kI8U7+mNNc7YMZ0T1hvW5I1AK88Pk\n2UhOTomPTU+W21QR6+9Vmw85HaWlyzNC3KUDcm91AoGBAMOYpjA8fmiwf8NYmJBA\n/zJOsa2k36zKL+3x/UnnHPKWb8M9WnbiEgX9FE7/gYwkRcW6EI3Ro1J/gj8Snujb\ntlWBxlcfRy0jQynr+LcWeS7JApx2Qtl5Ba12yNSWvYQ0+oz9dM1I6fWhimMGvwwX\nozugmXfxo6NXI+lRRrtrmzrX\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-y8njc@carmodify-lmo.iam.gserviceaccount.com",
  "client_id": "106330645817811096783",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-y8njc%40carmodify-lmo.iam.gserviceaccount.com"
}


admin.initializeApp(serviceAccount);

let db = admin.firestore();


  const pageaccesstoken = 'EAAhuvKStHYYBAAUlWZA12olvfCwZCYjZCZCYIyus5xjZBQD7iIIzun9eR1LpcVtYM4dUvohBvqral9rYCIB1ecvhJSS0ApUZBFp5mzXxmuxsyCme9ZBLI1TNfI7PzEukDwAIuUj8cbAUWCYXUxKcLq2lQME0a2hy2j4gEikF1CeNG6LDHGgo7HN'

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

// Creates the endpoint for our webhook cmd
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
                          "title": "car body",
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
                    
                    //start of car part rent 
                    {
                      "title":"Rent",
                      "image_url":"https://www.drivemyanmar.com/wp-content/uploads/2017/12/car-drift3.jpg",
                      "subtitle":"You can rent car bodykit,alloy wheels and spoiler",                      
                      "buttons":[
                        {
                          "type": "postback",
                          "title": "Car BodyKit",
                          "payload": "carbodykit"
                        },
                        {
                          "type": "postback",
                          "title": "Alloy Wheel",
                          "payload": "alloy"
                        },
                        {
                          "type": "postback",
                          "title": "Spoiler",
                          "payload": "spoi"
                        }
                      ]      
                    },
                    //end of car part rent 

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
                        },
                        {
                          "type":"postback",
                          "title":"Sell",
                          "payload":"sell"
                        },
                        {
                          "type":"postback",
                          "title":"Buy",
                          "payload":"buy"
                        }
                      ]      
                    }
                    //end of car part trade
                  ] 
                }
              }
            }
          }

          requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, 
            welcomeMessage
          ).then( response => {
            console.log(response)
          }).fail( error => {
            console.log(error)
          })

          requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, 
            genericMessage
          ).then( response => {
            console.log(response)
          }).fail( error => {
            console.log(error)
          })
        
        }
        

        //star of choose one user said popular carbody kit 

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
                      "title":"car-body kit",
                      "buttons":[
                        {
                          "type": "postback",
                          "title": "ironman kit",
                          "payload": "ik"
                        },
                        {
                          "type": "postback",
                          "title": "amuse kit",
                          "payload": "ak"
                        },
                        {

                          "type": "postback",
                          "title":"side skirt",
                          "payload":"ss"
                        }
                      ]      
                    },
                    {
                      "title":"RIM and tier",
                      "buttons":[{
                        "type":"postback",
                        "title":"Work Wheel Alloy",
                        "payload":"wwa"
                      },{
                      "type":"postback",
                      "title":"BBS alloy",
                      "payload":"bbs"
                      },
                      {
                        "type":"postback",
                        "title":"Tier recommandation",
                        "payload":"tr"
                      }
                      ]
                    },
                    {
                      "title":"exhaust",
                      "buttons":[
                        {
                        "type":"postback",
                        "title":"HKS",
                        "payload":"hks"
                      },
                      {
                      "type":"postback",
                      "title":"Armytrix",
                      "payload":"arm"
                      },
                      {
                        "type":"postback",
                        "title":"akrapovic",
                        "payload":"akrap"
                      }
                    ]
                    }
                  ] 
                }
              }
            }
          }


          requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, 
            genericMessage
          ).then( response => {
            console.log(response)
          }).fail( error => {
            console.log(error)
          })
        }
        //end of popular carbody kit 

        //start car interior 
        if(userButton == 'interior'){
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
                      "title":"interior modified suggestion",                    
                      "buttons":[
                        {
                          "type": "postback",
                          "title": "Seats",
                          "payload": "seats"
                        },
                        {
                          "type": "postback",
                          "title": "steering",
                          "payload": "steering"
                        },
                        {
                          "type":"postback",
                          "title":"window flims",
                          "payload":"windowf"
                        }
                      ]      
                    },
                   
                    {
                      "title":"interior modified suggestion",                     
                      "buttons":[
                        {
                          "type": "postback",
                          "title": "aaa",
                          "payload": "Trade"
                        },
                        {
                          "type": "postback",
                          "title": "aaa",
                          "payload": "Trade"
                        },
                        {
                          "type": "postback",
                          "title": "aaa",
                          "payload": "Trade"
                        }

                      ]      
                    },
                    {
                      "title":"interior modified shops location",                     
                      "buttons":[
                        {
                          "type": "postback",
                          "title": "Sule",
                          "payload": "Trade"
                        },
                        {
                          "type": "postback",
                          "title": "Sanchaung",
                          "payload": "Trade"
                        },
                        {
                          "type": "postback",
                          "title": "tarmwe",
                          "payload": "Trade"
                        }

                      ]      
                    }
                  ] 
                }
              }
            }
          }


          requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, 
            genericMessage
          ).then( response => {
            console.log(response)
          }).fail( error => {
            console.log(error)
          })
        }


        //if user car bodykit for rent 

        if(userButton == 'carbodykit'){
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
                      "image_url":"http://thumb2.zeppy.io/d/l400/pict/113862367311/bodykit-kazama-for-toyota-mark-2-110",
                      "title":"Avaliable body kit for rent",
                      "subtitle":"Fortuna bodykit toyota mark 2 jzx 110",                  
                      "buttons":[
                        {
                          "type": "postback",
                          "title": "rent",
                          "payload": "rent1"
                        }
                        
                      ]      
                    },
                    {
                      "image_url":"http://thumb2.zeppy.io/d/l400/pict/113862367311/bodykit-kazama-for-toyota-mark-2-110",
                      "title":"Avaliable body kit for rent",
                      "subtitle":"Hippo Sleek for Toyota mark 2 jzx110",                  
                      "buttons":[
                        {
                          "type": "postback",
                          "title": "rent",
                          "payload": "rent2"
                        }
                        
                      ]      
                    },
                    {
                      "image_url":"http://thumb2.zeppy.io/d/l400/pict/113862367311/bodykit-kazama-for-toyota-mark-2-110",
                      "title":"Avaliable body kit for rent",
                      "subtitle":"Mugen bodykit for Honda Fit(2009- 2012)",                  
                      "buttons":[
                        {
                          "type": "postback",
                          "title": "rent",
                          "payload": "rent3"
                        }
                        
                      ]      
                    },
                    {
                      "image_url":"http://thumb2.zeppy.io/d/l400/pict/113862367311/bodykit-kazama-for-toyota-mark-2-110",
                      "title":"Avaliable body kit for rent",
                      "subtitle":"iron-man bodykit for Suzuki Swift(2019)",                  
                      "buttons":[
                        {
                          "type": "postback",
                          "title": "rent",
                          "payload": "rent4"
                        }
                        
                      ]      
                    },
                    {
                      "image_url":"http://thumb2.zeppy.io/d/l400/pict/113862367311/bodykit-kazama-for-toyota-mark-2-110",
                      "title":"Avaliable body kit for rent",
                      "subtitle":"santos bodykit for Suzuki Ciaz (2019)",                  
                      "buttons":[
                        {
                          "type": "postback",
                          "title": "rent",
                          "payload": "rent5"
                        }
                        
                      ]      
                    },


                    

                  ] 
                }
              }
            }
          }


          requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, 
            genericMessage
          ).then( response => {
            console.log(response)
          }).fail( error => {
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