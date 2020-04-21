'use strict';

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  requestify = require('requestify'),
  app = express().use(bodyParser.json()); // creates express http server

const admin = require('firebase-admin');

var serviceAccount = JSON.parse(process.env.serviceAccount);




admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

  const pageaccesstoken = 'EAAhuvKStHYYBALTxZCuuVFy1dUwTDCvBvjgFa1J7VLnosst12RZB5WnrsZB3NG7HFOnJ18I2DzHrvZAFuQnnOzlgtgk95ZAZBNQBuoQtxlQBcnTZA6WWvSXRrFvvv95TmzyN4ylrLLeyGFJHHOG06tCEPZCeYdoaUnSNXyTBwlyz9AZDZD'

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
                      "subtitle":"You can rent car bodykit,alloy wheels and spoiler",                      
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
                      "title":"Car part trade",
                      "image_url":"http://nic.trade/img/trade.png",
                      "subtitle":"car part trade for same car part",                      
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
        // end of one part 


        //...................................................................................................................................
        //star of choose one user said popular carbody kit 
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
        //................................................................................................................

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
                          "title": "Audio",
                          "payload": "audioo"
                        },
                        {
                          "type": "postback",
                          "title": "Camera",
                          "payload": "camera"
                        },
                        {
                          "type": "postback",
                          "title": "Floor mat",
                          "payload": "floor_mat"
                        }
                      ]      
                    },
                    {
                      "title":"interior modified shops location",                     
                      "buttons":[
                        {
                          "type": "postback",
                          "title": "Sule",
                          "payload": "location_sule"
                        },
                        {
                          "type": "postback",
                          "title": "Sanchaung",
                          "payload": "location_sanchaung"
                        },
                        {
                          "type": "postback",
                          "title": "tarmwe",
                          "payload": "location_tarmwe"
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
        //................................................................................................................................
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
       ///...............................................................................................
       
      //........................................................................................................................
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
                        "type":"postback",
                        "title":"trade",
                        "payload":"tradeform"
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