const Alexa = require('ask-sdk');
var c = 0;
const SKILL_NAME = 'my buddy';
const CONT_MSG = "Do you want me to give you some more reminders?";
const REM_OVER = "Hey you are now ready to go! have a nice day. Bye";
const HELP_MESSAGE = 'Hi,Just let me know if you are going out. say something like I\'m leaving or ask did I forget something and I\'ll remind you some stuff';
const HELP_REPROMPT = 'let me know if you are leaving. I\'ll remind you some stuff' ;
const STOP_MESSAGE = 'Goodbye!';

var data = [
  'have the keys with you.',
  'make sure you turn off the lights.',
  'Take the magazine if you feel like.',
  'Take your Laptop with you if required.',
  'check for your Phone. ',
  'take the Umbrella if it is cloudy or raining. ',
  'Stay hydrated. Take your bottle with you. ',
  'Water your plants if you haven\'t.',
  'Arrange food for your pets.',
  'Consider turning off all the water.',
  'Unplug toasters, computers etc.',
  'close the curtains if needed.',
  'safety first. Take your helmet before leaving.'
];

const reminderIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'ReminderIntent') || ((request.type === 'IntentRequest' && request.intent.name === 'ContinueIntent') && (handlerInput.requestEnvelope.request.intent.slots.responseYN.resolutions.resolutionsPerAuthority[0].values[0].value.id == 1));
  },
  handle(handlerInput) {

    const myAttributesManager = handlerInput.attributesManager;
    var mySessionAttributes = myAttributesManager.getSessionAttributes();
    console.log("c is: "+ c);
    if(mySessionAttributes.count == undefined){
        mySessionAttributes.count = 0;
    }
    console.log("sa count: "+ mySessionAttributes.count);
    c = mySessionAttributes.count;
    const responseBuilder = handlerInput.responseBuilder;
    console.log("prev value: " + c);
    mySessionAttributes.count += 1;
    myAttributesManager.setSessionAttributes(mySessionAttributes);
    
    if(c >= data.length){
        const speechOutput = REM_OVER;
        return handlerInput.responseBuilder
          .speak(speechOutput)
          .withShouldEndSession(true)
          .getResponse();
    }
    else{
      var speechOutput = "";
      const randomReminder = data[c];
      if(c === 0){
        speechOutput = "hey, ";
      }
      speechOutput += randomReminder + CONT_MSG ;
      const reprompt = CONT_MSG;
    
      return handlerInput.responseBuilder
        .speak(speechOutput)
        .reprompt(reprompt)
        .getResponse();
    }

  },
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (request.type === 'IntentRequest' && request.intent.name === 'AMAZON.CancelIntent')
     || (request.intent.name === 'AMAZON.StopIntent') 
     || ((request.type === 'IntentRequest' && request.intent.name === 'ContinueIntent') && (handlerInput.requestEnvelope.request.intent.slots.responseYN.resolutions.resolutionsPerAuthority[0].values[0].value.id == 0));
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(STOP_MESSAGE)
      .withShouldEndSession(true)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I didn\'t get you. Can you repeat it?')
      .reprompt('Sorry, I didn\'t get you. Can you repeat it?')
      .getResponse();
  },
};

function shuffle(myarray) {
    let ctr = myarray.length;
    let temp;
    let index;
    while (ctr > 0) {
        index = Math.floor(Math.random() * ctr);
        ctr--;
        temp = myarray[ctr];
        myarray[ctr] = myarray[index];
        myarray[index] = temp;
    }
    return myarray;
}


data = shuffle(data);

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    reminderIntentHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
