/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This sample shows how to create a Lambda function for handling Alexa Skill requests that:
 *
 * - Custom slot type: demonstrates using custom slot types to handle a finite set of known values
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask Minecraft Helper how to make paper."
 *  Alexa: "(reads back recipe for paper)"
 */

'use strict';

var AlexaSkill = require('./AlexaSkill'),
    facts = require('./facts');

var APP_ID = 'amzn1.echo-sdk-ams.app.208d0fca-fe2a-497b-b43a-1d0d4cd0d431';

/**
 * internalBlock is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var InternalBlock = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
InternalBlock.prototype = Object.create(AlexaSkill.prototype);
InternalBlock.prototype.constructor = InternalBlock;

InternalBlock.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    var speechText = "Hello. I'm Robot Aaron, and I am in, a tube.  You can ask me a question about the alexa project like, what's up with mentors? ... Now, what can I help you with.";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "For instructions on what you can say, please say help me.";
    response.ask(speechText, repromptText);
};

InternalBlock.prototype.intentHandlers = {
    "factsIntent": function (intent, session, response) {
        var itemSlot = intent.slots.Item,
            itemName;
        if (itemSlot && itemSlot.value){
            itemName = itemSlot.value.toLowerCase();
        }

        var cardTitle = "Details for " + itemName,
            fact = facts[itemName],
            speechOutput,
            repromptOutput;
        if (fact) {
            speechOutput = {
                speech: fact,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            repromptOutput = {
                speech: "I can get you details about total skills, mentors, devices claimed, or current students ... Now, what would you like to know about?",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.askWithCard(speechOutput, repromptOutput, cardTitle, fact);
        } else {
            var speech;
            if (itemName) {
                speech = "I'm sorry, I currently do not know the details for " + itemName + ". What else can I help with?";
            } else {
                speech = "I'm sorry, I currently do not know that detail. What else can I help with?";
            }
            speechOutput = {
                speech: speech,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            repromptOutput = {
                speech: "I can get you details about total skills, mentors, echos claimed, or current students ... Now, what would you like to know about?",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.ask(speechOutput, repromptOutput);
        }
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye from Aaron in a tube.";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Cheers!";
        response.tell(speechOutput);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechText = "Hello. You can ask me questions about the alexa project such as, how many skills have been published, or, you can say exit...  Now, what can I help you with?";
        var repromptText = "You can say things like, how many skills have been published, or you can say exit... Now, what can I help you with?";
        var speechOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        var repromptOutput = {
            speech: repromptText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.ask(speechOutput, repromptOutput);
    }
};

exports.handler = function (event, context) {
    var internalBlock = new InternalBlock();
    internalBlock.execute(event, context);
};
