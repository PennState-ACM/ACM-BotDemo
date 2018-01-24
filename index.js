const request = require('request');
var ConversationV1 = require('watson-developer-cloud/conversation/v1');
var prompt = require('prompt-sync')();

var conversation = new ConversationV1({
    username: '06d3c964-0845-4df9-a3fd-1e0bfa7491fd', // replace with username from service key
    password: 'SEmZHBdVfAZC', // replace with password from service key
    path: { workspace_id: 'd1f0d0b6-a67b-4516-8235-a7f4ca826fa1' }, // replace with workspace ID
    version_date: '2017-11-15'
  });

let apiKey = v;
let city = 'Portland';
let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

// Start conversation with empty message.
conversation.message({}, processResponse);

function processResponse(err, response) {
    if (err) {
      console.error(err); // something went wrong
      return;
    }
  
    // Display the output from dialog, if any.
    if (response.output.text.length != 0) {
        console.log(response.output.text[0]);
    }

    if (response.intents.length > 0) {
        if(response.intents[0].intent == 'Weather'){
            if(response.entities.length > 0){
                console.log(response.entities);
                let city = response.entities[0].value;
                let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
                request(url, function (err, response, body) {
                    if(err){
                      console.log('error:', error);
                    } 
                    else {
                      let weather = JSON.parse(body);
                      //console.log(weather);
                  
                      let message = `It's ${weather.main.temp} degrees in ${weather.name}!`;
                      console.log(message);
                      var newMessageFromUser = prompt('>> ');
                      text = newMessageFromUser;
                      conversation.message({
                          input: { text: newMessageFromUser },
                          context : response.context,  
                          }, processResponse); 
                    }
                  });
            }
            else{
                //no city inputted
                var newMessageFromUser = prompt('>> ');
                text = newMessageFromUser;
                conversation.message({
                    input: { text: newMessageFromUser },
                    context : response.context,  
                    }, processResponse); 
            }
        
        }
        else{
            var newMessageFromUser = prompt('>> ');
            text = newMessageFromUser;
            conversation.message({
                input: { text: newMessageFromUser },
                context : response.context,  
                }, processResponse); 
        }
    }
    else{
        var newMessageFromUser = prompt('>> ');
        text = newMessageFromUser;
        conversation.message({
            input: { text: newMessageFromUser },
            context : response.context,  
            }, processResponse); 
    }
}