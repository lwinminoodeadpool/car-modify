'use strict';

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  requestify = require('requestify'),
  app = express().use(bodyParser.json()); // creates express http server

const admin = require('firebase-admin');

var serviceAccount = JSON.parse(process.env.serviceAccount);

var feedback = [];


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

  const pageaccesstoken = 'EAAhuvKStHYYBADZCfTyHZB44MOEBzTdcCyGvZAnoDi000WgJF2T4ig9nxXiB43qW7rqcsmEQZAYuNSAnhfhhmtc7XaVKj9Ddbq6oB4uJ9ZBdX8lUd4h9GPpc3i5NLpAujNJYHveQ9vAtBokjc8WVTZCngtOYUunZC6ym8EM7YpUyAZDZD'

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

requestify.post('https://graph.facebook.com/v6.0/me/messenger_profile?access_token='+pageaccesstoken, {
    "persistent_menu": [
        {
            "locale": "default",
            "composer_input_disabled": false,
            "call_to_actions": [
                {
                    "type": "web_url",
                    "title": "Sell Car Parts",
                    "url": "https://carmodify.herokuapp.com/sell",
                    "webview_height_ratio": "full"
                },
                {
                    "type": "postback",
                    "title": "Feedback",
                    "payload": "makeFeedback"
                },
                {
                  "type": "postback",
                  "title": "Menu",
                  "payload": "Hi"
              }
            ]
        }
    ]
}).then(success=>{console.log(success)});

app.set('view engine', 'ejs');
app.set('views', __dirname+'/views')

app.get('/orderConfirm/:rentType/:Item/:CarBrand/:Month/:price/:name', function(req,res) {
  var rentType = req.params.rentType;
  var item = req.params.Item;
  var brand = req.params.CarBrand;
  var month = req.params.Month;
  var price = req.params.price;
  var name = req.params.name;
  res.render('index', {rentType: rentType, item: item, brand: brand, month: month, price: price, name: name})
})

app.get('/sell', function(req,res) {
  res.render('sell')
})

app.get('/trade', function(req,res) {
  res.render('trade')
})

app.get('/buy/:itemName/:itemPrice', function(req,res) {
  var itemName = req.params.itemName;
  var itemPrice = req.params.itemPrice;
  res.render('buy', {itemName: itemName, itemPrice: itemPrice});
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
        if(webhook_event.message){
          var userInput = webhook_event.message.text
        }
        if(webhook_event.postback){
          var userInput = webhook_event.postback.payload
        }
        if(feedback.includes(`${webhook_event.sender.id}`)){
          db.collection('userFeedback').add({
            sender: webhook_event.sender.id,
            feedback: userInput
          }).then(success => {
            var num = feedback.indexOf(`${webhook_event.sender.id}`)
            feedback.splice(num, 1);
            let replyMessage = {
              "recipient":{
                "id":webhook_event.sender.id
              },
              "message":{
                "text":"Thank you for your feedback!"
              }
            };
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, 
              replyMessage
            ).then( response => {
              console.log(response)
            }).fail( error => {
              console.log(error)
            })
          })
        }
        if (userInput == 'Hi'){
          let welcomeMessage = {
            "recipient":{
              "id":webhook_event.sender.id
            },
            "message":{
              "text":"Hello, Welcome to Curious Wheel!"
            }
          };
          //..................................................................................................................
          //start of function 

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
                      "image_url":"https://pbs.twimg.com/media/CxndsUYVQAAeN35.jpg",
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
                      "image_url":"https://www.logolynx.com/images/logolynx/d8/d8713bda4da556fd93992c3fe5bbb20f.jpeg",
                      "subtitle":"You can rent car parts form Curious Wheel",                      
                      "buttons":[
                        {
                          "type": "postback",
                          "title": "Head Light",
                          "payload": "rent_headlight"
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
                    {
                      "title":"Rent",
                      "image_url":"https://www.logolynx.com/images/logolynx/d8/d8713bda4da556fd93992c3fe5bbb20f.jpeg",
                      "subtitle":"You can rent various car parts form us",                      
                      "buttons":[
                        {
                          "type": "postback",
                          "title": "Exhaust",
                          "payload": "rent_exhaust"
                        },
                        {
                          "type": "postback",
                          "title": "steering",
                          "payload": "rent_steering"
                        },
                        {
                          "type": "postback",
                          "title": "seats",
                          "payload": "rent_seats"
                        }
                      ]      
                    },
                    //end of car part rent 

                    //start of car parts trade
                    {
                      "title":"Car parts",
                      "image_url":"https://www.vbtc.vu/images/trade-logo.png",
                      "subtitle":"Car parts buy,sell and trade",                      
                      "buttons":[
                        {
                          "type": "postback",
                          "title": "Car part trade",
                          "payload": "tradecar"
                        },
                        {
                          "type":"web_url",
                          "url":"https://carmodify.herokuapp.com/sell",
                          "title":"Sell",
                          "webview_height_ratio": "full"
                        },
                        {
                          "type":"postback",
                          "title":"Buy",
                          "payload":"buy"
                        }
                      ]      
                    }
                  ] 
                }
              }
            }
          }
          requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, 
            welcomeMessage
          ).then( response => {
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, 
              genericMessage
            ).then( response => {
              console.log(response)
            }).fail( error => {
              console.log(error)
            })
          }).fail( error => {
            console.log(error)
          })
          
        }
        // end of one part 

        //feedback
        if(userInput == 'makeFeedback'){
          let genericMessage = {
            "recipient":{
              "id":webhook_event.sender.id
            },
            "message":{
              "text": "Please type anything and send us we will check your feedback regularly!"
            }
          }
          requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, 
            genericMessage
          ).then( response => {
            feedback.push(webhook_event.sender.id);
          }).fail( error => {
            console.log(error)
          })
        }
        //end of feedback


        //star of bodykit 

        if(userInput == 'bodykit'){
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
                          "title": "Maruti body kit",
                          "payload": "ik"
                        },
                        {
                          "type": "postback",
                          "title": "amuse body kit",
                          "payload": "ak"
                        },
                        {

                          "type": "postback",
                          "title":"Mugen body kit",
                          "payload":"mg"
                        }
                      ]      
                    },
                    {
                      "title":"RIM and Tier",
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
                        "title":"Tires recommandation",
                        "payload":"tr"
                      }
                      ]
                    },
                    {
                      "title":"Popular Car Modify Shops ✔️",
                      "buttons":[
                        {
                        "type":"postback",
                        "title":"Naing Car bodykit",
                        "payload":"ncb"
                      },
                      {
                      "type":"postback",
                      "title":"Rio Racing",
                      "payload":"rio"
                      },
                      {
                        "type":"postback",
                        "title":"Pro Racing",
                        "payload":"prr"
                      },
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
        // car bodykit 
        if(userInput =='ik'){
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
                      "title":"Maruti body kit",
                      "image_url":"https://static.wixstatic.com/media/a5db25_94143ed060804d73985bfb0156e97ffb~mv2_d_2501_1667_s_2.jpg/v1/fill/w_980,h_543,fp_0.50_0.50,q_90/a5db25_94143ed060804d73985bfb0156e97ffb~mv2_d_2501_1667_s_2.jpg",
                      "subtitle":"For Suzuki Swfit 2018\nAvaliable in\nNaing carbodykit",
                      "buttons":[
                        {
                          "type":"web_url",
                          "url":"https://web.facebook.com/naingcarbodykit",
                          "title":"Go to Shop",
                          "webview_height_ratio": "full"
                        },
                        {
                          "type": "postback",
                          "title": "back",
                          "payload": "bodykit"
                        }
                      ]      
                    },
                    {
                      "title":"Maruti body kit",
                      "image_url":"https://wheelsindreams.com/wp-content/uploads/2019/06/maxresdefault.jpg",
                      "subtitle":"For Suzuki Swfit 2018\nAvaliable in\nNaing carbodykit",
                      "buttons":[
                        {
                          "type":"web_url",
                          "url":"https://web.facebook.com/naingcarbodykit",
                          "title":"Go to Shop",
                          "webview_height_ratio": "full"
                        },
                        {
                          "type": "postback",
                          "title": "back",
                          "payload": "bodykit"
                        }
                        
                      ]      
                    },
                    {
                      "title":"Maruti body kit",
                      "image_url":"https://img.indianautosblog.com/resize/750x-/2019/01/25/modified-maruti-suzuki-ciaz-white-front-three-quar-f7cb.jpg",
                      "subtitle":"For Suzuki Ciaz 2018\nAvaliable in\nNaing carbodykit",
                      "buttons":[
                        {
                          "type":"web_url",
                          "url":"https://web.facebook.com/naingcarbodykit",
                          "title":"Go to Shop",
                          "webview_height_ratio": "full"
                        },
                        {
                          "type": "postback",
                          "title": "back",
                          "payload": "bodykit"
                        },
                        
                      ]      
                    },
                    {
                      "title":"Maruti body kit",
                      "image_url":"https://www.team-bhp.com/forum/attachments/official-new-car-reviews/1429330d1445263563-maruti-ciaz-official-review-marutisuzukiciazrs12.jpg",
                      "subtitle":"For Suzuki Ciaz 2018\nAvaliable in\nNaing carbodykit",
                      "buttons":[
                        {
                          "type":"web_url",
                          "url":"https://web.facebook.com/naingcarbodykit",
                          "title":"Go to Shop",
                          "webview_height_ratio": "full"
                        },
                        {
                          "type": "postback",
                          "title": "back",
                          "payload": "bodykit"
                        },
                        
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
        //bodykit 
        if(userInput =='ak'){
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
                      "title":"Amuse body kit",
                      "image_url":"https://i.pinimg.com/originals/8b/f6/87/8bf687913e1c7bf79e691fde6eb28092.jpg",
                      "subtitle":"For Nissan Fair Lady 350 and 370\nAvaliable in\nPro racing ",
                      "buttons":[
                        {
                          "type":"web_url",
                          "url":"https://web.facebook.com/Pro.racing.mm",
                          "title":"Go to Shop",
                          "webview_height_ratio": "full"
                        },
                        {
                          "type": "postback",
                          "title": "back",
                          "payload": "bodykit"
                        },
                        
                      ]      
                    },
                    {
                      "title":"Amuse body kit",
                      "image_url":"https://live.staticflickr.com/6125/5924279283_9f0ef25eb4_b.jpg",
                      "subtitle":"For Nissan Fair Lady 350 and 370\nAvaliable in\nPro racing  ",
                      "buttons":[
                        {
                          "type":"web_url",
                          "url":"https://web.facebook.com/Pro.racing.mm",
                          "title":"Go to Shop",
                          "webview_height_ratio": "full"
                        },
                        {
                          "type": "postback",
                          "title": "back",
                          "payload": "bodykit"
                        },
                        
                      ]      
                    },
                    {
                      "title":"Amuse body kit",
                      "image_url":"https://ae01.alicdn.com/kf/Hd2cdc0690b494d82b040a5dc93d6ca5fo/FRP-AMUSE-Front-Bumper-For-Nissan-Z33-350z-Infiniti-G35-2003-2008-Coupe-2Door-AM-Style.jpg_640x640q70.jpg",
                      "subtitle":"For Nissan Fair Lady 350 and 370\nAvaliable in\nPro racing  ",
                      "buttons":[
                        {
                          "type":"web_url",
                          "url":"https://web.facebook.com/Pro.racing.mm",
                          "title":"Go to Shop",
                          "webview_height_ratio": "full"
                        },
                        {
                          "type": "postback",
                          "title": "back",
                          "payload": "bodykit"
                        },
                        
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
        //bodykit
        if(userInput =='mg'){
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
                      "title":"Mugan body kit",
                      "image_url":"https://cdn.motor1.com/images/mgl/BNw9j/s1/2013-408121-2014-honda-fit-by-mugen-06-09-20131.jpg",
                      "subtitle":"For honda fit\nAvaliable in\nNaing carbodykit",
                      "buttons":[
                        {
                          "type":"web_url",
                          "url":"https://web.facebook.com/naingcarbodykit",
                          "title":"Go to Shop",
                          "webview_height_ratio": "full"
                        },
                        {
                          "type": "postback",
                          "title": "back",
                          "payload": "bodykit"
                        },
                        
                      ]      
                    },
                    {
                      "title":"Mugan body kit",
                      "image_url":"https://wallup.net/wp-content/uploads/2019/09/230823-2014-mugen-honda-fit-r-s-tuning-748x561.jpg",
                      "subtitle":"For honda fit\nAvaliable in\nNaing carbodykit",
                      "buttons":[
                        {
                          "type":"web_url",
                          "url":"https://web.facebook.com/naingcarbodykit",
                          "title":"Go to Shop",
                          "webview_height_ratio": "full"
                        },
                        {
                          "type": "postback",
                          "title": "back",
                          "payload": "bodykit"
                        },
                        
                      ]      
                    },
                    {
                      "title":"Mugan body kit",
                      "image_url":"https://performancedrive.com.au/wp-content/uploads/2013/06/Mugen-2013-Honda-Civic-sedan-bodykit.jpg",
                      "subtitle":"For Honda Civic\nAvaliable in\nNaing carbodykit",
                      "buttons":[
                        {
                          "type":"web_url",
                          "url":"https://web.facebook.com/naingcarbodykit",
                          "title":"Go to Shop",
                          "webview_height_ratio": "full"
                        },
                        {
                          "type": "postback",
                          "title": "back",
                          "payload": "bodykit"
                        },
                        
                      ]      
                    },
                    {
                      "title":"Mugan body kit",
                      "image_url":"https://img.gta5-mods.com/q95/images/2008-honda-civic-type-r-fd2-add-on-rhd-mugen-j-s-racing/89b0d9-46615cd4b31c8701833e2f7c2c7f9e2f0608ffb7.jpg",
                      "subtitle":"For Honda Civic\nAvaliable in\nNaing carbodykit",
                      "buttons":[
                        {
                          "type":"web_url",
                          "url":"https://web.facebook.com/naingcarbodykit",
                          "title":"Go to Shop",
                          "webview_height_ratio": "full"
                        },
                        {
                          "type": "postback",
                          "title": "back",
                          "payload": "bodykit"
                        },
                        
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
        //alloy and tier 
        if(userInput =='wwa'){
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
                      "title":"Wrok wheel alloy",
                      "image_url":"https://img.favpng.com/16/11/4/car-work-wheels-rim-alloy-wheel-png-favpng-tAvxnPPF6c20CDRvamcXrgfcd.jpg",
                      "subtitle":"Avaliable in 16' 18\nAvaliable in\nRio racing",
                      "buttons":[
                        {
                          "type":"web_url",
                          "url":"https://web.facebook.com/rioracingmotorsport",
                          "title":"Shop page",
                          "webview_height_ratio": "full"
                        },
                        {
                          "type": "postback",
                          "title": "back",
                          "payload": "bodykit"
                        },
                        
                      ]      
                    },
                    {
                      "title":"Wrok wheel alloy",
                      "image_url":"https://img.favpng.com/3/10/5/alloy-wheel-tire-work-wheels-toyota-crown-png-favpng-B3zQacpsyy0v8nELJgpyFjri0.jpg",
                      "subtitle":"Avaliable in 16' 18\nAvaliable in\nRio racing",
                      "buttons":[
                        {
                          "type":"web_url",
                          "url":"https://web.facebook.com/rioracingmotorsport",
                          "title":"Shop page",
                          "webview_height_ratio": "full"
                        },
                        {
                          "type": "postback",
                          "title": "back",
                          "payload": "bodykit"
                        },
                        
                      ]      
                    },
                    {
                      "title":"Wrok wheel alloy",
                      "image_url":"https://img.favpng.com/13/10/12/car-work-wheels-alloy-wheel-nissan-png-favpng-tbiZ4Bey2AbLm7hJr5vp1UJ1P.jpg",
                      "subtitle":"Avaliable in 16' 18'\nAvaliable in\nRio racing",
                      "buttons":[
                        {
                          "type":"web_url",
                          "url":"https://web.facebook.com/rioracingmotorsport",
                          "title":"Shop page",
                          "webview_height_ratio": "full"
                        },
                        {
                          "type": "postback",
                          "title": "back",
                          "payload": "bodykit"
                        },
                        
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
        //alloy and tier 
        if(userInput =='bbs'){
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
                      "title":"BBS alloy",
                      "image_url":"https://cdn.imgbin.com/21/21/25/imgbin-car-bbs-kraftfahrzeugtechnik-rim-alloy-wheel-bmw-car-9p2ZG97LnJErDEK9405fRu7U5.jpg",
                      "subtitle":"Avaliable in 16' 18'\nAvaliable in\nRio racing",
                      "buttons":[
                        {
                          "type":"web_url",
                          "url":"https://web.facebook.com/rioracingmotorsport",
                          "title":"Shop page",
                          "webview_height_ratio": "full"
                        },
                        {
                          "type": "postback",
                          "title": "back",
                          "payload": "bodykit"
                        },
                        
                      ]      
                    },
                    {
                      "title":"BBS alloy",
                      "image_url":"https://img.favpng.com/16/19/20/car-bbs-kraftfahrzeugtechnik-porsche-alloy-wheel-bmw-png-favpng-HSNevGdJRV532Fc6FyTATvtxP.jpg",
                      "subtitle":"Avaliable in 16' 18'\nAvaliable in\nRio racing",
                      "buttons":[
                        {
                          "type":"web_url",
                          "url":"https://web.facebook.com/rioracingmotorsport",
                          "title":"Shop page",
                          "webview_height_ratio": "full"
                        },
                        {
                          "type": "postback",
                          "title": "back",
                          "payload": "bodykit"
                        },
                        
                      ]      
                    },
                    {
                      "title":"BBS alloy",
                      "image_url":"https://www.pngitem.com/pimgs/m/424-4246273_car-wheel-apr-directory-listing-for-includes-img.png",
                      "subtitle":"Avaliable in 16' 18'\nAvaliable in\nRio racing",
                      "buttons":[
                        {
                          "type":"web_url",
                          "url":"https://web.facebook.com/rioracingmotorsport",
                          "title":"Shop page",
                          "webview_height_ratio": "full"
                        },
                        {
                          "type": "postback",
                          "title": "back",
                          "payload": "bodykit"
                        },
                        
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
        //tier 
        if(userInput =='tr'){
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
                      "title":"Maxxis Tire",
                      "image_url":"https://www.tyremarket.com/tyremantra/wp-content/uploads/2017/05/Maxxis-Car-Tyres-e1494579301416.jpg",
                      "subtitle":"Recommended brand\nAvaliable in\nKo Kyi Soe Tire and alloy",
                      "buttons":[
                        {
                          "type":"web_url",
                          "url":"https://web.facebook.com/kokyisoetyrealloycap",
                          "title":"Shop page",
                          "webview_height_ratio": "full"
                        },
                        {
                          "type": "postback",
                          "title": "back",
                          "payload": "bodykit"
                        },
                        
                      ]      
                    },
                    {
                      "title":"Michelin",
                      "image_url":"https://qwikfixwheeltyre.com/img/photo/tyre5.jpg",
                      "subtitle":"Recommended brand\nAvaliable in\nKo Kyi Soe Tire and alloy",
                      "buttons":[
                        {
                          "type":"web_url",
                          "url":"https://web.facebook.com/kokyisoetyrealloycap",
                          "title":"Shop page",
                          "webview_height_ratio": "full"
                        },
                        {
                          "type": "postback",
                          "title": "back",
                          "payload": "bodykit"
                        },
                        
                      ]      
                    },
                    {
                      "title":"Yokohama",
                      "image_url":"https://www.pngitem.com/pimgs/m/105-1056950_7-yokohama-tire-logo-hd-png-download.png",
                      "subtitle":"Recommended brand\nAvaliable in\nKo Kyi Soe Tire and alloy",
                      "buttons":[
                        {
                          "type":"web_url",
                          "url":"https://web.facebook.com/kokyisoetyrealloycap",
                          "title":"Shop page",
                          "webview_height_ratio": "full"
                        },
                        {
                          "type": "postback",
                          "title": "back",
                          "payload": "bodykit"
                        },
                        
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
        //car shops 
        if(userInput =='ncb'){
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
                      "title":"Naing car body kit",
                      "subtitle":"Verified shop ☑️",
                      "buttons":[
                        {
                          "type":"web_url",
                          "url":"https://web.facebook.com/naingcarbodykit",
                          "title":"Shop page",
                          "webview_height_ratio": "full"
                        },
                        {
                          "type":"phone_number",
                          "title":"call now",
                          "payload":"+95 09 254 575 529"
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
        //car shop 
        if(userInput =='rio'){
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
                      "title":"Rio Racing",
                      "subtitle":"Verified shop ☑️",
                      "buttons":[
                        {
                          "type":"web_url",
                          "url":"https://web.facebook.com/rioracingmotorsport",
                          "title":"Shop page",
                          "webview_height_ratio": "full"
                        },
                        {
                          "type":"phone_number",
                          "title":"call now",
                          "payload":" +95 09 250 877 766"
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
        ///car shop 
        if(userInput =='prr'){
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
                      "title":"Pro Racing",
                      "subtitle":"Verified shop ☑️",
                      "buttons":[
                        {
                          "type":"web_url",
                          "url":"https://web.facebook.com/Pro.racing.mm",
                          "title":"Shop page",
                          "webview_height_ratio": "full"
                        },
                        {
                          "type":"phone_number",
                          "title":"call now",
                          "payload":" +95 09 971 546756"
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
        //---------------------
        //start car interior 
        if(userInput == 'interior'){
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
                          "title": "Window Flim",
                          "payload": "wf"
                        },
                        {
                          "type": "postback",
                          "title": "Black Box",
                          "payload": "bbx"
                        },
                        {
                          "type":"postback",
                          "title":"Sound system",
                          "payload":"ssy"
                        }
                      ]      
                    },
                    
                    {
                      "title":"Popular interior modified shops ☑️",                     
                      "buttons":[
                        {
                          "type": "postback",
                          "title": "Pro Racing",
                          "payload": "prr"
                        },
                        {
                          "type": "postback",
                          "title": "Rio racing",
                          "payload": "rio"
                        },
                        {
                          "type": "postback",
                          "title": "Gloary",
                          "payload": "gl"
                        }
                      ]      
                    },
                    {
                      "title":"Popular interior modified shops ☑️",                     
                      "buttons":[
                        {
                          "type": "postback",
                          "title": "GTR car Accessories",
                          "payload": "gtt"
                        },
                        {
                          "type": "postback",
                          "title": "Casper",
                          "payload": "casp"
                        },
                        {
                          "type": "postback",
                          "title": "Dr Polish",
                          "payload": "dr"
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
        //car window flim 
        if(userInput =='wf'){
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
                      "title":"3M window Flim",
                      "image_url":"https://image.made-in-china.com/43f34j00bOiEpRgMqfzh/Safety-Privacy-3m-Solar-Window-Film.jpg",
                      "subtitle":"Avaliable in\nBateThar-AutoArt",
                      "buttons":[
                        {
                          "type":"web_url",
                          "url":"https://web.facebook.com/batetharautoart",
                          "title":"Shop page",
                          "webview_height_ratio": "full"
                        },
                        {
                          "type": "postback",
                          "title": "back",
                          "payload": "interior"
                        },
                      ]      
                    },
                    {
                      "title":"samiJDM AUTOMOTIVE FILM",
                      "image_url":"https://autoquarterly.com/wp-content/uploads/2018/06/Tesla-Motors-Model-S-Window-Tint-Prestige-PhotoSync-film-installed-after-7-min-1.jpg",
                      "subtitle":"Avaliable in\nA1 Car Window Film,Ppf & Coating",
                      "buttons":[
                        {
                          "type":"web_url",
                          "url":"https://web.facebook.com/A1DETAILINGWAIZAYANTAR",
                          "title":"Shop page",
                          "webview_height_ratio": "full"
                        },
                        {
                          "type": "postback",
                          "title": "back",
                          "payload": "interior"
                        },
                        
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
        //car black box
        if(userInput =='bbx'){
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
                      "title":"Blaupunkt car black box",
                      "image_url":"https://www.blaupunkt.com/uploads/tx_ddfproductsbp/BPDV165-1_0.jpg",
                      "subtitle":"Avaliable in\nPro racing",
                      "buttons":[
                        {
                          "type":"web_url",
                          "url":"https://web.facebook.com/Pro.racing.mm",
                          "title":"Shop page",
                          "webview_height_ratio": "full"
                        },
                        {
                          "type": "postback",
                          "title": "back",
                          "payload": "interior"
                        },
                      ]      
                    },
                    {
                      "title":"i-Drive car black box",
                      "image_url":"https://media.karousell.com/media/photos/products/2018/05/11/idrive_i11_in_car_camera_black_box_full_hd_frontback_1526038133_a1483198.jpg",
                      "subtitle":"Avaliable in\nPro racing",
                      "buttons":[
                        {
                          "type":"web_url",
                          "url":"https://web.facebook.com/Pro.racing.mm",
                          "title":"Shop page",
                          "webview_height_ratio": "full"
                        },
                        {
                          "type": "postback",
                          "title": "back",
                          "payload": "interior"
                        },
                        
                      ]      
                    },
                    {
                      "title":"Hella car black box",
                      "image_url":"https://c.76.my/Malaysia/hella-dr760-driving-recorder-wifi-fhd-2-channel-sgwangacc-1807-11-sgwangacc@9.jpg",
                      "subtitle":"Avaliable in\nPro racing",
                      "buttons":[
                        {
                          "type":"web_url",
                          "url":"https://web.facebook.com/Pro.racing.mm",
                          "title":"Shop page",
                          "webview_height_ratio": "full"
                        },
                        {
                          "type": "postback",
                          "title": "back",
                          "payload": "interior"
                        },
                        
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
        //car sound system 
        if(userInput =='ssy'){
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
                      "title":"Blaupunkt car speaker",
                      "image_url":"https://images-na.ssl-images-amazon.com/images/I/51b1oIlHlZL._SX466_.jpg",
                      "subtitle":"Avaliable in\nPro racing",
                      "buttons":[
                        {
                          "type":"web_url",
                          "url":"https://web.facebook.com/Pro.racing.mm",
                          "title":"Shop page",
                          "webview_height_ratio": "full"
                        },
                        {
                          "type": "postback",
                          "title": "back",
                          "payload": "interior"
                        },
                      ]      
                    },
                    {
                      "title":"Blaupunkt car woofer",
                      "image_url":"https://c.76.my/Malaysia/blaupunkt-gtr-130-compact-active-subwoofer-100w-rms-12volts-1908-27-12volts@2.jpg",
                      "subtitle":"Avaliable in\nPro racing",
                      "buttons":[
                        {
                          "type":"web_url",
                          "url":"https://web.facebook.com/Pro.racing.mm",
                          "title":"Shop page",
                          "webview_height_ratio": "full"
                        },
                        {
                          "type": "postback",
                          "title": "back",
                          "payload": "interior"
                        },
                        
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
        //car popular modify shop 
        //gl
        if(userInput =='gl'){
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
                      "title":"Glory Car Accessories",
                      "subtitle":"Verified shop ☑️",
                      "buttons":[
                        {
                          "type":"web_url",
                          "url":"https://web.facebook.com/Glory-Car-Accessories-333620803785315",
                          "title":"Shop page",
                          "webview_height_ratio": "full"
                        },
                        {
                          "type":"phone_number",
                          "title":"call now",
                          "payload":" +95 09 764 646141"
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
        //gtt
        if(userInput =='gtt'){
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
                      "title":"GTR car decoration & accessories",
                      "subtitle":"Verified shop ☑️",
                      "buttons":[
                        {
                          "type":"web_url",
                          "url":"https://web.facebook.com/GTRmandalay",
                          "title":"Shop page",
                          "webview_height_ratio": "full"
                        },
                        {
                          "type":"phone_number",
                          "title":"call now",
                          "payload":" +95 09 431 01323"
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
        //casp
        if(userInput =='casp'){
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
                      "title":"Casper car sticker ,decoration&accessories",
                      "subtitle":"Verified shop ☑️",
                      "buttons":[
                        {
                          "type":"web_url",
                          "url":"https://web.facebook.com/Casper-car-sticker-decorationaccessories-260787930786233",
                          "title":"Shop page",
                          "webview_height_ratio": "full"
                        },
                        {
                          "type":"phone_number",
                          "title":"call now",
                          "payload":" +95 09 541 0110"
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
        //dr 
        if(userInput =='dr'){
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
                      "title":"Dr. Polish",
                      "subtitle":"Verified shop ☑️",
                      "buttons":[
                        {
                          "type":"web_url",
                          "url":"https://web.facebook.com/toekhanttoegyii",
                          "title":"Shop page",
                          "webview_height_ratio": "full"
                        },
                        {
                          "type":"phone_number",
                          "title":"call now",
                          "payload":" +95 09 254 129 354"
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





        //star of rent session 
        //if user rent_headlight 
        if(userInput == 'rent_headlight'){
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
                  ] 
                }
              }
            }
          } 
          var i = 0;
          db.collection('rent').where("Type", "==", "headlightrent").get().then(result => {
             result.forEach(items => {
               let headItem = {
                 "image_url": items.data().Img,
                 "title": items.data().Name,
                 "subtitle": "available head light for rent",
                 "buttons" : [
                   {
                    "type": "postback",
                    "title": "Rent",
                    "payload": `headlightrent/${items.data().payload}/headlight`
                   }
                 ]
               }
               genericMessage.message.attachment.payload.elements.push(headItem);
    
               i = i+1
    
               if(i == result.size){
                requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, 
                  genericMessage
                ).then( response => {
                  console.log(response)
                }).fail( error => {
                  console.log(error)
                })
               }
             })
           })
              
              
            }

       
        //................................................................................................................................
       //database head light databse order  
       if(userInput.includes('headlightrent/')){
         var userPayload = userInput.split('/')
         var rentType = userPayload[0]
         var headlight = userPayload[1]
         var brand = userPayload[2]
         var profileLink = 'https://graph.facebook.com/'+webhook_event.sender.id+'?fields=first_name,last_name&access_token='+pageaccesstoken
         var userName = []
         requestify.get(profileLink).then(function(success){
           var response = success.getBody();
          userName.push(response.first_name)
          userName.push(response.last_name)
          userName = userName.join(' ')
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
                    "title":"Price",
                    "subtitle":"you need to pay 20000ks for deposit to rent the body kit. Monthly fees:",                  
                    "buttons":[
                      {
                        "type": "web_url",
                        "title": "One Month:20000",
                        "url": `https://carmodify.herokuapp.com/orderConfirm/${rentType}/${headlight}/${brand}/1/20000/${userName}`,
                        "webview_height_ratio": "full"
                      },
                      {
                        "type": "web_url",
                        "title": "Two Months:30000",
                        "url": `https://carmodify.herokuapp.com/orderConfirm/${rentType}/${headlight}/${brand}/2/30000/${userName}`,
                        "webview_height_ratio": "full"
                      },
                      {
                        "type": "web_url",
                        "title": "Three Months:40000",
                        "url": `https://carmodify.herokuapp.com/orderConfirm/${rentType}/${headlight}/${brand}/3/40000/${userName}`,
                        "webview_height_ratio": "full"
                      },                      
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
         })
      }
      //...................................................................................................
     //if user rent alloy 
     if(userInput == 'alloy'){
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
              ] 
            }
          }
        }
      } 
      var i = 0;
      db.collection('rent').where("Type", "==", "alloyWheel").get().then(result => {
         result.forEach(items => {
           let wheelItem = {
             "image_url": items.data().Img,
             "title": items.data().Name,
             "subtitle": "available alloy for rent",
             "buttons" : [
               {
                "type": "postback",
                "title": "Rent",
                "payload": `alloyrent/${items.data().payload}/alloy`
               }
             ]
           }
           genericMessage.message.attachment.payload.elements.push(wheelItem);

           i = i+1

           if(i == result.size){
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, 
              genericMessage
            ).then( response => {
              console.log(response)
            }).fail( error => {
              console.log(error)
            })
           }
         })
       })
          
          
        }
        //..............................................................................................................................
        //database alloy
        if(userInput.includes('alloyrent/')){
          var userPayload = userInput.split('/')
          var rentType = userPayload[0]
          var alloy = userPayload[1]
          var brand = userPayload[2]
          var profileLink = 'https://graph.facebook.com/'+webhook_event.sender.id+'?fields=first_name,last_name&access_token='+pageaccesstoken
          var userName = []
          requestify.get(profileLink).then(function(success){
            var response = success.getBody();
           userName.push(response.first_name)
           userName.push(response.last_name)
           userName = userName.join(' ')
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
                     "title":"Price",
                     "subtitle":"you need to pay 20000ks for deposit to rent the body kit. Monthly fees:",                  
                     "buttons":[
                       {
                         "type": "web_url",
                         "title": "One Month:20000",
                         "url": `https://carmodify.herokuapp.com/orderConfirm/${rentType}/${alloy}/${brand}/1/20000/${userName}`
                       },
                       {
                         "type": "web_url",
                         "title": "Two Months:30000",
                         "url": `https://carmodify.herokuapp.com/orderConfirm/${rentType}/${alloy}/${brand}/2/30000/${userName}`
                       },
                       {
                         "type": "web_url",
                         "title": "Three Months:40000",
                         "url": `https://carmodify.herokuapp.com/orderConfirm/${rentType}/${alloy}/${brand}/3/40000/${userName}`
                       },                       
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
          })
       }
       //......................................................................................................................
       //start spoiler rent 
       if(userInput == 'spoi'){
        var genericMessage = {
          "recipient":{
            "id":webhook_event.sender.id
          },
          "message":{
            "attachment":{
              "type":"template",
              "payload":{
                "template_type":"generic",
                "elements":[
                ] 
              }
            }
          }
        } 
        var i = 0;
        db.collection('rent').where("Type", "==", "spoilerrent").get().then(result => { 
          result.forEach(items => {
            console.log(items.data())
             var spoilerItem = {
               "image_url": `${items.data().Img}`,
               "title": `${items.data().Name}`,
               "subtitle": "available spoiler for rent",
               "buttons" : [
                 {
                  "type": "postback",
                  "title": "Rent",
                  "payload": `spoirent/${items.data().payload}/spoi`
                 }
               ]
             }
             genericMessage.message.attachment.payload.elements.push(spoilerItem);
  
             i = i+1
  
             if(i == result.size){
               console.log(genericMessage.message.attachment.payload);
              requestify.post(`https://graph.facebook.com/v6.0/me/messages?access_token=${pageaccesstoken}`, 
                genericMessage
              ).then( response => {
              }).fail( error => {
                console.log(error)
              })
             }
           })
          
         })
            
            
          }
      //.................................................................................................................
        //database spoiler 
        if(userInput.includes('spoirent/')){
          var userPayload = userInput.split('/')
          var rentType = userPayload[0]
          var spoi = userPayload[1]
          var brand = userPayload[2]
          var profileLink = 'https://graph.facebook.com/'+webhook_event.sender.id+'?fields=first_name,last_name&access_token='+pageaccesstoken
          var userName = []
          requestify.get(profileLink).then(function(success){
            var response = success.getBody();
           userName.push(response.first_name)
           userName.push(response.last_name)
           userName = userName.join(' ')
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
                     "title":"Price",
                     "subtitle":"you need to pay 20000ks for deposit to rent the spoiler. Monthly fees:",                  
                     "buttons":[
                       {
                         "type": "web_url",
                         "title": "One Month:20000",
                         "url": `https://carmodify.herokuapp.com/orderConfirm/${rentType}/${spoi}/${brand}/1/20000/${userName}`
                       },
                       {
                         "type": "web_url",
                         "title": "Two Months:30000",
                         "url": `https://carmodify.herokuapp.com/orderConfirm/${rentType}/${spoi}/${brand}/2/30000/${userName}`
                       },
                       {
                         "type": "web_url",
                         "title": "Three Months:40000",
                         "url": `https://carmodify.herokuapp.com/orderConfirm/${rentType}/${spoi}/${brand}/3/40000/${userName}`
                       },  
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
          })
       }
       ///..............................................................................................
      //start of rent exhaust 
      if(userInput == 'rent_exhaust'){
        var genericMessage = {
          "recipient":{
            "id":webhook_event.sender.id
          },
          "message":{
            "attachment":{
              "type":"template",
              "payload":{
                "template_type":"generic",
                "elements":[
                ] 
              }
            }
          }
        } 
        var i = 0;
        db.collection('rent').where("Type", "==", "exhaust_rent").get().then(result => { 
          result.forEach(items => {
            console.log(items.data())
             var exhaustItem = {
               "image_url": `${items.data().Img}`,
               "title": `${items.data().Name}`,
               "subtitle": "available exhaust for rent",
               "buttons" : [
                 {
                  "type": "postback",
                  "title": "Rent",
                  "payload": `exhaust_rent/${items.data().payload}/exhaust`
                 }
               ]
             }
             genericMessage.message.attachment.payload.elements.push(exhaustItem);
  
             i = i+1
  
             if(i == result.size){
               console.log(genericMessage.message.attachment.payload);
              requestify.post(`https://graph.facebook.com/v6.0/me/messages?access_token=${pageaccesstoken}`, 
                genericMessage
              ).then( response => {
              }).fail( error => {
                console.log(error)
              })
             }
           })
          
         })
          }
      //.................................................................................................................
        //database exhaust
        if(userInput.includes('exhaust_rent/')){
          var userPayload = userInput.split('/')
          var rentType = userPayload[0]
          var exhaust = userPayload[1]
          var brand = userPayload[2]
          var profileLink = 'https://graph.facebook.com/'+webhook_event.sender.id+'?fields=first_name,last_name&access_token='+pageaccesstoken
          var userName = []
          requestify.get(profileLink).then(function(success){
            var response = success.getBody();
           userName.push(response.first_name)
           userName.push(response.last_name)
           userName = userName.join(' ')
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
                     "title":"Price",
                     "subtitle":"you need to pay 20000ks for deposit to rent the spoiler. Monthly fees:",                  
                     "buttons":[
                       {
                         "type": "web_url",
                         "title": "One Month:20000",
                         "url": `https://carmodify.herokuapp.com/orderConfirm/${rentType}/${exhaust}/${brand}/1/20000/${userName}`
                       },
                       {
                         "type": "web_url",
                         "title": "Two Months:30000",
                         "url": `https://carmodify.herokuapp.com/orderConfirm/${rentType}/${exhaust}/${brand}/2/30000/${userName}`
                       },
                       {
                         "type": "web_url",
                         "title": "Three Months:40000",
                         "url": `https://carmodify.herokuapp.com/orderConfirm/${rentType}/${exhaust}/${brand}/3/40000/${userName}`
                       },  
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
          })
       }

       //..........................................................................................................
       //rent of rent_steering
       if(userInput == 'rent_steering'){
        var genericMessage = {
          "recipient":{
            "id":webhook_event.sender.id
          },
          "message":{
            "attachment":{
              "type":"template",
              "payload":{
                "template_type":"generic",
                "elements":[
                ] 
              }
            }
          }
        } 
        var i = 0;
        db.collection('rent').where("Type", "==", "steering_rent").get().then(result => { 
          result.forEach(items => {
            console.log(items.data())
             var steeringItem = {
               "image_url": `${items.data().Img}`,
               "title": `${items.data().Name}`,
               "subtitle": "available steering for rent",
               "buttons" : [
                 {
                  "type": "postback",
                  "title": "Rent",
                  "payload": `steering_rent/${items.data().payload}/steering`
                 }
               ]
             }
             genericMessage.message.attachment.payload.elements.push(steeringItem);
  
             i = i+1
  
             if(i == result.size){
               console.log(genericMessage.message.attachment.payload);
              requestify.post(`https://graph.facebook.com/v6.0/me/messages?access_token=${pageaccesstoken}`, 
                genericMessage
              ).then( response => {
              }).fail( error => {
                console.log(error)
              })
             }
           })
          
         })
          }
          //..........................................................................................
          //database for steering rent
          if(userInput.includes('steering_rent/')){
            var userPayload = userInput.split('/')
            var rentType = userPayload[0]
            var steering = userPayload[1]
            var brand = userPayload[2]
            var profileLink = 'https://graph.facebook.com/'+webhook_event.sender.id+'?fields=first_name,last_name&access_token='+pageaccesstoken
            var userName = []
            requestify.get(profileLink).then(function(success){
              var response = success.getBody();
             userName.push(response.first_name)
             userName.push(response.last_name)
             userName = userName.join(' ')
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
                       "title":"Price",
                       "subtitle":"you need to pay 20000ks for deposit to rent the spoiler. Monthly fees:",                  
                       "buttons":[
                         {
                           "type": "web_url",
                           "title": "One Month:20000",
                           "url": `https://carmodify.herokuapp.com/orderConfirm/${rentType}/${steering}/${brand}/1/20000/${userName}`
                         },
                         {
                           "type": "web_url",
                           "title": "Two Months:30000",
                           "url": `https://carmodify.herokuapp.com/orderConfirm/${rentType}/${steering}/${brand}/2/30000/${userName}`
                         },
                         {
                           "type": "web_url",
                           "title": "Three Months:40000",
                           "url": `https://carmodify.herokuapp.com/orderConfirm/${rentType}/${steering}/${brand}/3/40000/${userName}`
                         },  
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
            })
         }
        //.........................................................................................
        //rent seat rent 
        if(userInput == 'rent_seats'){
          var genericMessage = {
            "recipient":{
              "id":webhook_event.sender.id
            },
            "message":{
              "attachment":{
                "type":"template",
                "payload":{
                  "template_type":"generic",
                  "elements":[
                  ] 
                }
              }
            }
          } 
          var i = 0;
          db.collection('rent').where("Type", "==", "seatsrent").get().then(result => { 
            result.forEach(items => {
              console.log(items.data())
               var seatsItem = {
                 "image_url": `${items.data().Img}`,
                 "title": `${items.data().Name}`,
                 "subtitle": "available seats for rent",
                 "buttons" : [
                   {
                    "type": "postback",
                    "title": "Rent",
                    "payload": `seats_rent/${items.data().payload}/seats`
                   }
                 ]
               }
               genericMessage.message.attachment.payload.elements.push(seatsItem);
    
               i = i+1
    
               if(i == result.size){
                 console.log(genericMessage.message.attachment.payload);
                requestify.post(`https://graph.facebook.com/v6.0/me/messages?access_token=${pageaccesstoken}`, 
                  genericMessage
                ).then( response => {
                }).fail( error => {
                  console.log(error)
                })
               }
             })
            
           })
            }
            //.............................................................
            //database rentseats
            if(userInput.includes('seats_rent/')){
              var userPayload = userInput.split('/')
              var rentType = userPayload[0]
              var seats = userPayload[1]
              var brand = userPayload[2]
              var profileLink = 'https://graph.facebook.com/'+webhook_event.sender.id+'?fields=first_name,last_name&access_token='+pageaccesstoken
              var userName = []
              requestify.get(profileLink).then(function(success){
                var response = success.getBody();
               userName.push(response.first_name)
               userName.push(response.last_name)
               userName = userName.join(' ')
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
                         "title":"Price",
                         "subtitle":"you need to pay 20000ks for deposit to rent the spoiler. Monthly fees:",                  
                         "buttons":[
                           {
                             "type": "web_url",
                             "title": "One Month:20000",
                             "url": `https://carmodify.herokuapp.com/orderConfirm/${rentType}/${seats}/${brand}/1/20000/${userName}`
                           },
                           {
                             "type": "web_url",
                             "title": "Two Months:30000",
                             "url": `https://carmodify.herokuapp.com/orderConfirm/${rentType}/${seats}/${brand}/2/30000/${userName}`
                           },
                           {
                             "type": "web_url",
                             "title": "Three Months:40000",
                             "url": `https://carmodify.herokuapp.com/orderConfirm/${rentType}/${seats}/${brand}/3/40000/${userName}`
                           },  
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
              })
           }
           //..................................................................................


       //car par trade start
      
       if(userInput == 'tradecar'){
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
                    "title":"what you want to trade from Curious Wheel?",                    
                    "buttons":[
                      {
                        "type": "postback",
                        "title": "Alloy Wheel",
                        "payload": "alloywheeltrade"
                      },
                      {
                        "type": "postback",
                        "title": "Head Lamp",
                        "payload": "headlamptrade"
                      },
                      {
                        "type":"postback",
                        "title":"Seat",
                        "payload":"seattrade"
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

      if(userInput == 'alloywheeltrade'){
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
                    "image_url":"https://www.motorsportstore.eu/eng_pl_Set-of-4-Alloy-Wheels-OZ-Racing-SUPERTURISMO-GT-6-5x15-4x100-ET37-3303_1.jpg",
                 "title": 'Oz racing wheel alloy ',
                 "subtitle": 'Price=200000Ks',                  
                    "buttons":[
                      {
                        "type":"web_url",
                          "url":"https://carmodify.herokuapp.com/trade",
                          "title":"trade",
                          "webview_height_ratio": "full"
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
      //star of buy//
      if(userInput == 'buy'){
        var genericMessage = {
          "recipient":{
            "id":webhook_event.sender.id
          },
          "message":{
            "attachment":{
              "type":"template",
              "payload":{
                "template_type":"generic",
                "elements":[
                ] 
              }
            }
          }
        } 
        var i = 0;
        db.collection('buy').where("Type", "==", "buy_item").get().then(result => { 
          result.forEach(items => {
             var buyItem = {
               "image_url": `${items.data().Img}`,
               "title": `${items.data().Name}`,
               "subtitle": `${items.data().Price}`,
               "buttons" : [
                 {
                  "type": "web_url",
                  "url":"https://carmodify.herokuapp.com/buy/"+items.data().Name+"/"+items.data().Price,
                  "title": "Buy",
                 }
               ]
             }
             genericMessage.message.attachment.payload.elements.push(buyItem);
  
             i = i+1
             
             if(i == result.size){
              requestify.post(`https://graph.facebook.com/v6.0/me/messages?access_token=${pageaccesstoken}`, 
                genericMessage
              ).then( response => {
                genericMessage.message.attachment.payload.elements=[]
              }).fail( error => {
                console.log(error)
              })
             }
           })
          
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