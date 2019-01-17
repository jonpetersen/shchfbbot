// index.js
'use strict';
const moment = require('moment');
const BootBot = require('bootbot');
const echoModule = require('/home/jon/node_modules/bootbot/examples/modules/echo');

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

bot.setGreetingText("Hi, welcome to Surrey Hills Cycle Hire. You can use this automated chat to book up to 3 bikes, up to 3 days ahead. Tap 'Get Started' below to start a conversation.");
bot.setGetStartedButton((payload, chat) => {
  // Send a button template
  chat.say({
	text: 'What would you like to do?',
	buttons: [
		{ type: 'postback', title: 'Hire bike(s)', payload: 'HIRE' },
		{ type: 'postback', title: 'Book a bike tour', payload: 'TOUR' },
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
	    askNbikes(convo);  
      }
    },
    {
	  event: 'postback:MTB',
      callback: (payload, convo) => {
	    console.log('Hire MTB was chosen');
	    convo.set('biketype', 'MTB');
	    askNbikes(convo);  
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
	    convo.set('nbikes', 'ONE');
	    askDate(convo);  
      }
    }
  ]);
};


/*
const askNbikes = (convo) => {
  convo.ask(`How many bikes would you like to hire?`, (payload, convo, data) => {    
    const text = payload.message.text;
    convo.set('nbikes', text);
    convo.say(`OK`).then(() => {
      console.log(`Hire ${convo.get('nbikes')} ${convo.get('biketype')} was chosen`);
      convo.say(`Ok, here's what you told me:
      - Activity: ${convo.get('activity')}
      - Type of Bike: ${convo.get('biketype')}
      - Number of Bikes: ${convo.get('nbikes')}
      `).then(() => askDate(convo));
      
    });
  });
};
*/

/*
const askDate = (convo) => {
  convo.ask(`On what date would you like to hire?`, (payload, convo, data) => {
    const text = payload.message.text;
    convo.set('date', text);
    convo.say(`OK`).then(() => {
      console.log(`Hire ${convo.get('nbikes')} ${convo.get('biketype')} on ${convo.get('date')} was chosen`);
      convo.say(`Ok, here's what you told me:
      - Activity: ${convo.get('activity')}
      - Type of Bike: ${convo.get('biketype')}
      - Number of Bikes: ${convo.get('nbikes')}
      - Date of hire: ${convo.get('date')}
      `);
    });
    convo.end();
  });
};
*/

const askDate = (convo) => {
//   const dateToday = (new Date()).toLocaleDateString();
  const dateToday = moment(Date.now()).format('DD/MM/YYYY')
  convo.ask((convo) => {
    const buttons = [
      { type: 'postback', title: `Today ${dateToday}`, payload: 'TODAY' },
	  { type: 'postback', title: 'Tomorrow', payload: 'TOMORROW' },
	  { type: 'postback', title: 'Today + 2', payload: 'TODAY+2' }
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
        console.log(`Hire ${convo.get('nbikes')} ${convo.get('biketype')} on ${convo.get('date')} was chosen`);
        convo.say(`Ok, here's what you told me:
        - Activity: ${convo.get('activity')}
        - Type of Bike: ${convo.get('biketype')}
        - Number of Bikes: ${convo.get('nbikes')}
        - Date of hire: ${convo.get('date')}
        `);
      }
    }
  ]);
};

bot.on('postback:HIRE', (payload, chat) => 
    {
	  console.log('The Hire button was clicked!');
      chat.conversation((convo) => {
      convo.set('activity', 'Bike Hire');
      convo.sendTypingIndicator(1000).then(() => askBiketype(convo));
  });
});

bot.on('message', (payload, chat) => {
	const text = payload.message.text;
	console.log(`The user said: ${text}`);
});

bot.start();

/*
/* Start the Hire conversation 

bot.on('postback:HIRE', (payload, chat) => 
    {
	  console.log('The Hire button was clicked!');
	  chat.conversation(convo => {
        convo.ask(
          {
          text: 'What type of bike(s) would you like to hire?',
          buttons: [
	  	  { type: 'postback', title: 'Electric Mountain Bike', payload: 'EMTB' },
	  	  { type: 'postback', title: 'Mountain Bike', payload: 'MTB' },
	  	  { type: 'postback', title: 'Road Bike', payload: 'ROAD' }
	      ]
          }, 
          (payload, convo) => {  
            const text = payload.message.text;
            console.log(`message text is ${text}.`);
          }, 
          [{event: 'postback:EMTB',
            callback: (payload, convo) => 
            {
            console.log('EMTB was chosen');
            const bike_type = 'Electric Mountain Bike(s)';
            convo.question(
              {
	           text: `What's your favorite color?`
              },
              (payload, convo) => 
              {
               const text = payload.message.text;
               console.log('number asked');
               convo.say(`OK you want to hire ${text}.`);
               convo.end();
              })
            }
          }]);
        }, 
        {
        typing: true    
        }
      ); /* convo.ask 
    }
);


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
*/


