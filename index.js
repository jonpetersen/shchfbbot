// index.js
'use strict';
const BootBot = require('bootbot');
const echoModule = require('/home/jon/node_modules/bootbot/examples/modules/echo');

const bot = new BootBot({
  accessToken: 'EAAcYTe4hUJwBAJqd7WbicZCJRci5ZBeM9oQF8z1tZBQ2tZB3i6inXsZADGqqw9mzOKp20ihG8rd7wP28GJOOd4wPuyKzrGJAikjurdcfERsIs0hfc1h57PrGvMWLVZCZBmEaGVG5qecAi3pb2H7oARKlvZAmWJLwYy87WsHtO1qfLQZDZD',
  verifyToken: 'EAAcYTe4hUEAAcYTe4hUEAAcYTe4hUEAAcYTe4hUEAAcYTe4hU',
  appSecret: '5ef79b1d88321f5c75679c1ef74dd79d'
});

bot.module(echoModule);

bot.setGreetingText('Hey there! Welcome to Surrey Hills Cycle Hire!');
bot.setGetStartedButton((payload, chat) => {
  chat.say("I'm Jon. What are you looking for?");
});

bot.setPersistentMenu([
  {
    type: 'postback',
    title: 'Help',
    payload: 'PERSISTENT_MENU_HELP'
  },
  {
    type: 'postback',
    title: 'Settings',
    payload: 'PERSISTENT_MENU_SETTINGS'
  },
  {
    type: 'web_url',
    title: 'Go to our Website',
    url: 'https://surreyhillscyclehire.co.uk'
  }
]);

bot.on('postback:PERSISTENT_MENU_HELP', (payload, chat) => {
  chat.say(`I'm here to help!`);
});

bot.on('postback:PERSISTENT_MENU_SETTINGS', (payload, chat) => {
  chat.say(`Here are your settings: ...`);
});

bot.on('message', (payload, chat) => {
	const text = payload.message.text;
	console.log(`The user said: ${text}`);
});

bot.hear(['hello', 'hi', /hey( there)?/i], (payload, chat) => {
	console.log('The user said "hello", "hi", "hey", or "hey there"');
});

bot.start();
