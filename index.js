const Alexa = require('ask-sdk');

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
    if(c == -1){
        mySessionAttributes.count = 0;
    }
    c = mySessionAttributes.count;
    
    const responseBuilder = handlerInput.responseBuilder;
    console.log("prev value: " + c);
    mySessionAttributes.count += 1;
    myAttributesManager.setSessionAttributes(mySessionAttributes);
    
    if(c > 7){
        const speechOutput = "Hey you are now ready to go! have a nice day. Bye";
        const reprompt = "have a nice day! bye";
        
        return handlerInput.responseBuilder
          .speak(speechOutput)
          .reprompt(reprompt)
          .withSimpleCard(SKILL_NAME + speechOutput)
          .getResponse();
    }
    else{
      const randomReminder = data[c];
      const speechOutput = "Hey! " + randomReminder +  " Would you like me to give you some more reminders?";
      const reprompt = "umm, Would you like me to give you some more reminders?";
    
      return handlerInput.responseBuilder
        .speak(speechOutput)
        .reprompt(reprompt)
        .withSimpleCard(SKILL_NAME + 'Reminder', randomReminder)
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

function shuffle(array1) {
    let ctr = array1.length;
    let temp;
    let index;

    while (ctr > 0) {
        index = Math.floor(Math.random() * ctr);
        ctr--;
        //swap
        temp = array1[ctr];
        array1[ctr] = array1[index];
        array1[index] = temp;
    }
    return array1;
}

var c = -1;

const SKILL_NAME = 'my-reminder';
const HELP_MESSAGE = 'Hi,Just let me know if you are going out. say something like I\'m leaving or ask did I forget something and I\'ll remind you some stuff';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

var data = [
  'have the keys with you.',
  'make sure you turn off the lights.',
  'Take the magazine if you feel like.',
  'Take your Laptop with you if required.',
  'check for your Phone. ',
  'take the Umbrella if it is cloudy or raining. ',
  'Stay hydrated. Take your bottle with you. '
];
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