// index.js
'use strict';
const moment = require('moment');
const BootBot = require('bootbot');
const echoModule = require('/home/jon/node_modules/bootbot/examples/modules/echo');

const typingIndtime = 1000;

// Settings are for Facebook App SHCH Test Bot
// Token is from SHCH Test Bot page
// SHCH Test Bot page is the subscribed page under webhooks
// Selected events: messages, messaging_postbacks, messaging_optins, message_deliveries, message_reads
// remember to add /webhook to ngrok url for testing


const bot = new BootBot({
  accessToken: 'EAADXvPDODOEBAN5cod7wd9QXzEXyrCR0zczF6qUc2WdY4m7KoEcL2U7NXAZCAJvbGMi7cy0fzYouXcX8EbrZASVuURJphRi8mVIJE1xsH5eU3ZAM5FZCzaX1Jt7Sfh97J9kV2IDI3V2b4bgWZBZCCUnq1ZBHLCNnoSPFVlNSZB7YewZDZD',
  verifyToken: 'EAAcYTe4hUEAAcYTe4hUEAAcYTe4hUEAAcYTe4hUEAAcYTe4hU',
  appSecret: '0cde6ac5a3c18c74afa6b8d563d27a98'
});

bot.module(echoModule);

bot.deletePersistentMenu();

bot.setGreetingText("Hi, welcome to Surrey Hills Cycle Hire. You can use this automated chat to book up to 3 bikes, up to 3 days ahead. Tap 'Get Started' below to start a conversation.");
bot.setGetStartedButton((payload, chat) => {
  // Send a button template
  chat.say({
	text: 'What would you like to do?',
	buttons: [
		{ type: 'postback', title: 'Hire bike(s)', payload: 'HIRE' },
//		{ type: 'postback', title: 'Book a bike tour', payload: 'TOUR' },
		{ type: 'postback', title: 'Ask a question', payload: 'QUESTION' }
	]
  });
});

const askBiketype = (convo) => {
  convo.ask((convo) => {
    const buttons = [
      { type: 'postback', title: 'E-Mountain Bike', payload: 'EMTB' },
	  { type: 'postback', title: 'Mountain Bike', payload: 'MTB' },
	  { type: 'postback', title: 'Road Bike', payload: 'ROAD' }
    ];
    convo.sendButtonTemplate(`What type of bike(s) would you like to hire?`, buttons);
  }, (payload, convo, data) => {
    const text = payload.message.text;
    }, [
    {
      event: 'postback:EMTB',
      callback: (payload, convo) => {
	    console.log('Hire EMTB was chosen');
	    convo.set('biketype', 'EMTB');
	    convo.sendTypingIndicator(typingIndtime).then(() => askNbikes(convo));  
      }
    },
    {
	  event: 'postback:MTB',
      callback: (payload, convo) => {
	    console.log('Hire MTB was chosen');
	    convo.set('biketype', 'MTB');
	    convo.sendTypingIndicator(typingIndtime).then(() => askNbikes(convo));  
      }
    }
    ]);
};

const askNbikes = (convo) => {
  convo.ask((convo) => {
    const buttons = [
      { type: 'postback', title: '1', payload: 'ONE' },
	  { type: 'postback', title: '2', payload: 'TWO' },
	  { type: 'postback', title: '3', payload: 'THREE' }
	];
    convo.sendButtonTemplate(`How many bikes would you like to hire?`, buttons);
  }, (payload, convo, data) => {
    const text = payload.message.text;
    }, [
    {
      event: 'postback:ONE',
      callback: (payload, convo) => {
	    console.log('Hire ONE was chosen');
	    convo.set('nbikes', '1');
	    convo.sendTypingIndicator(typingIndtime).then(() => askDate(convo));  
      }
    },
    {
	  event: 'postback:TWO',
      callback: (payload, convo) => {
	    console.log('Hire TWO was chosen');
	    convo.set('nbikes', '2');
	    convo.sendTypingIndicator(typingIndtime).then(() => askDate(convo));
	   }
	 },
    {
	  event: 'postback:THREE',
      callback: (payload, convo) => {
	    console.log('Hire THREE was chosen');
	    convo.set('nbikes', '3');
	    convo.sendTypingIndicator(typingIndtime).then(() => askDate(convo));
	   }
	 }
  ]);
};

const askDate = (convo) => {
//   const dateToday = (new Date()).toLocaleDateString();
  const dateToday = moment(Date.now()).format('ddd Do MMM');
  const dateTomorrow = moment(Date.now()).add(1, 'days').format('ddd Do MMM');
  const dateTodayplus2 = moment(Date.now()).add(2, 'days').format('ddd Do MMM');
  
  convo.ask((convo) => {
    const buttons = [
      { type: 'postback', title: `Today ${dateToday}`, payload: 'TODAY' },
	  { type: 'postback', title: `Tomorrow ${dateTomorrow}`, payload: 'TOMORROW' },
	  { type: 'postback', title: `${dateTodayplus2}`, payload: 'TOMORROW' }
  ];
  convo.sendButtonTemplate(`On what date would you like to hire?`, buttons);
  }, (payload, convo, data) => {
    const text = payload.message.text;
    }, [
    {
      event: 'postback:TODAY',
      callback: (payload, convo) => {
	    console.log('Hire today was chosen');
	    convo.set('date', 'today');
      }
    },
    {
      event: 'postback:TOMORROW',
      callback: (payload, convo) => {
	    console.log('Hire tomorrow was chosen');
	    convo.set('date', 'tomorrow');
      }
    },
    {
      event: 'postback:TOMORROW',
      callback: (payload, convo) => {
	    console.log('Hire today + 2 was chosen');
	    convo.set('date', `${dateTodayplus2}`);
      }
    }
    ]);
};

bot.on('postback:HIRE', (payload, chat) => 
    {
	  console.log('The Hire button was clicked!');
      chat.conversation((convo) => {
      convo.set('activity', 'Bike Hire');
      convo.sendTypingIndicator(typingIndtime).then(() => askBiketype(convo));
  });
});

bot.on('message', (payload, chat) => {
	const text = payload.message.text;
	console.log(`The user said: ${text}`);
});

bot.on('message', (payload, chat) => {
	const text = payload.message.text;
	console.log(`The user said: ${text}`);
});

bot.hear(['hello', 'hi', /hey( there)?/i], (payload, chat) => {
	console.log('The user said "hello", "hi", "hey", or "hey there"');
});

bot.start();

