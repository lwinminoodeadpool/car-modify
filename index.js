'use strict';

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  requestify = require('requestify'),
  app = express().use(bodyParser.json()); // creates express http server

const admin = require('firebase-admin');

var serviceAccount ={
  "type": "service_account",
  "project_id": "carmodify-lmo",
  "private_key_id": "7cc065115da896f4dd4c666f5d3657fe5a91e050",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDUDAut1jwlhkJQ\nF7Zu9iehuZf34wyroo2BjQk3mUcDGeQL0sCGNhoAWNY7v0PPcWEpJFmnc7j9B/fm\n93i3OAzoE1c0vCiP/X9Ov1J6ZjR+Tcl7bcSa45fzm5BP5OnJDuj/JWlpT57LIbdp\nGLUo9jbveESYSpMg2OePkhItRYqqIvbMImjn9b/KT55WP8F1K/8pC7tOL9rBHWL4\nsrsuokiPB3k7XIgwgrJibFGyjocU9fhfEDK+Vq7eIrM+UFHhhFfLWLBbfFI6dD7I\nERzlbdmd+7bxJjQiudpJ1FBleQQCpJ4whaVnORCV/0+zm+KDY21+ZgdkECjfWIwG\niniV+DU3AgMBAAECggEAX3MmpLMtcuS7H+t0owEp+NoexqZNM0tiMEFIt17HQOWc\nKhhNsnxS+voCQXXIs+3BAzCKLN7iFABMvoqCK9NOt/7Qv/u8tIgzEML9gPxVv88L\nFYTlPaWaZj2N2fDcrbUI+6UfDJkbDSwZr/S/w3cFZok4M2dKUDxjC9UAWqGVmBx/\nzbT1BYrTBNljKRiqlwOEp7zZJ10LMukLRS6sffbDGj5SRc9/2Hl7UaBMFbOIXe9V\ntl/nhHjPkX4mLZK69WQLEagE3AFeFD1G8hA1YumNaR/2BBYZO+a2RLYocV39TTmT\nOG+vzkdSL6pYLLD2OW6sWDhNujAbvXheNhKmFz5CaQKBgQD45Usqya0Y2jwWtTNd\nVfijmnEoru3e6/FGhLFc8J00vBihm2OBCBBpbbHI1KU2V8HZ0uyqFzutMiVdu5Ef\n8qBChDYdoRkl0O19LrfsIzBQw18rGLM8LE8HXLZTtPRJdzolxVLUv1VfKWkQQf1w\nWeev26FIuMm9xBmHeomE1lVCGQKBgQDaGX7L3J69aFJAxCN/ns17oMeKyd03Ynd/\nhYEw3nzkOd/P6duR2xXNjDq2fqz3A9owl1PtNUM+x0VQp0/HvvjWIuZp/oK5rXC0\nTTiMneO3YyCzFhCg96m7eIOQXlGD3AVZJeuAw4b1NgiVdUMumywfq4lDXbFE3NNf\nR0FB+Kw7zwKBgDhnnjVAJx4uttdekRlh1ksdQO+7VOTkC3WztI4faUD+L4bQNCiV\nr0J1PYkJx7cdBC1dA404XqnNZ3Jqg2T+Ext/4tOsIorTYj6wS7YT82saG4Mkwdmt\nIOvGMvudUo8jmeXdZfwYsDw0oj6w9cJ0XXEZEN/uIKoEutRdDLUx7XhhAoGBAL66\nTQg6hxdcg5Hf9KtGVKwojlfw8GPe2GHMfo4eA1oSwocwG7QRw59dYnr1jIz38XdM\n3zgxu/zKhvNhXYNwnmulWZqX1/pIkqcaYLmX2ewl5BK42RHrg6NOYL9/vAlz/7lW\nT/zrALqv5hHN2lKHoK6RdBhVdxChjLdluMvYi8ZBAoGAc3RC+Ga6OcPaAaQdJoEN\n/dUmeIRkaC+7Ym84qOXNzumq6ZSRa2gHZKRZGY+riIaYWQgRlQS0pHA2qdIbSYsY\nK2q9NxY64II9W5LLeZzSUTIOmF50BfXI9DrsTa/6bUQVm+SdTcGnuhaK/RTX2OVJ\n0sGO6bcsl8b+VjoP/PatLyE=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-y8njc@carmodify-lmo.iam.gserviceaccount.com",
  "client_id": "106330645817811096783",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-y8njc%40carmodify-lmo.iam.gserviceaccount.com"
}




admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();


  const pageaccesstoken = 'EAAhuvKStHYYBADH7fb2OYXkowbQFVjqvT8uOYyFg68f6nkTsF3wSs2kdez3SXbVYqIAwJxemTArJD9ZA7BSC9QGl2LekOfmwKTLixuH1IfTxIiQUU9XQXbDdeBjMGPH6gqrIAr5uncNHG2zsulKdc7u9zoHYYv7eMaXuwAcPWqnewzAOk'

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
        //if user car bodykit for rent 
        if(userInput == 'carbodykit'){
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
                      "title":"Fortuna bodykit toyota mark 2 jzx 110",
                      "subtitle":"Avaliable body kit for rent",                  
                      "buttons":[
                        {
                          "type": "postback",
                          "title": "Rent",
                          "payload": "bodykitrent/fortuna/toyota"
                        }
                        
                      ]      
                    },
                    {
                      "image_url":"http://thumb2.zeppy.io/d/l400/pict/113862367311/bodykit-kazama-for-toyota-mark-2-110",
                      "title":"Hippo Sleek for Toyota mark 2 jzx110",
                      "subtitle":"Avaliable body kit for rent",                  
                      "buttons":[
                        {
                          "type": "postback",
                          "title": "Rent",
                          "payload": "bodykitrent/hippo/toyota"
                        }
                        
                      ]      
                    },
                    {
                      "image_url":"http://thumb2.zeppy.io/d/l400/pict/113862367311/bodykit-kazama-for-toyota-mark-2-110",
                      "title":"Mugen bodykit for Honda Fit(2009- 2012)",
                      "subtitle":"Avaliable body kit for rent",                  
                      "buttons":[
                        {
                          "type": "postback",
                          "title": "Rent",
                          "payload": "bodykitrent/mugen/honda"
                        }
                        
                      ]      
                    },
                    {
                      "image_url":"http://thumb2.zeppy.io/d/l400/pict/113862367311/bodykit-kazama-for-toyota-mark-2-110",
                      "title":" iron-man bodykit for Suzuki Swift(2019)",
                      "subtitle":"Avaliable body kit for rent",                  
                      "buttons":[
                        {
                          "type": "postback",
                          "title": "Rent",
                          "payload": "bodykitrent/iron-man/suzuki"
                        }
                        
                      ]      
                    },
                    {
                      "image_url":"http://thumb2.zeppy.io/d/l400/pict/113862367311/bodykit-kazama-for-toyota-mark-2-110",
                      "title":" santos bodykit for Suzuki Ciaz (2019)",
                      "subtitle":"Avaliable body kit for rent",                  
                      "buttons":[
                        {
                          "type": "postback",
                          "title": "Rent",
                          "payload": "bodykitrent/santos/suzuki"
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
        //................................................................................................................................
       //database bodykit rent databse order  
       if(userInput.includes('bodykitrent/')){
         var userPayload = userInput.split('/')
         var rentType = userPayload[0]
         var bodyKit = userPayload[1]
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
                        "url": `https://carmodify.herokuapp.com/orderConfirm/${rentType}/${bodyKit}/${brand}/1/20000/${userName}`,
                        "webview_height_ratio": "full"
                      },
                      {
                        "type": "web_url",
                        "title": "Two Months:30000",
                        "url": `https://carmodify.herokuapp.com/orderConfirm/${rentType}/${bodyKit}/${brand}/2/30000/${userName}`,
                        "webview_height_ratio": "full"
                      },
                      {
                        "type": "web_url",
                        "title": "Three Months:40000",
                        "url": `https://carmodify.herokuapp.com/orderConfirm/${rentType}/${bodyKit}/${brand}/3/40000/${userName}`,
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
             console.log(items.data().Img)
             var spoilerItem = {
               "image_url": `${items.data().Img}`,
               "title": `${items.data().Name}`,
               "subtitle": "available alloy for rent",
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
                    "image_url":"https://media.karousell.com/media/photos/products/2017/04/29/hks_hi_power_spec_r_exhaust_system_for_subaru_impreza_wrx_1493449045_c0eca7d2.jpg",
                    "title":"exhaust",
                    "subtitle":"Avaliable exhaust for rent",                  
                    "buttons":[
                      {
                        "type": "postback",
                        "title": "Rent",
                        "payload": "spoirent/star/spoiler"
                      }                      
                    ]      
                  },
                  {
                    "image_url":"https://ae01.alicdn.com/kf/HTB1Shu8Xf5G3KVjSZPxq6zI3XXac.jpg_q50.jpg",
                    "title":"exhaust",
                    "subtitle":"Avaliable spoiler for rent",                  
                    "buttons":[
                      {
                        "type": "postback",
                        "title": "Rent",
                        "payload": "spoirent/circle/spoiler"
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
                  
      });
  
      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  
  });