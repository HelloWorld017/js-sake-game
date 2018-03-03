require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');
const checkLibrary = require('./npm');

const token = process.env.TELEGRAM_TOKEN;
const botname = process.env.BOT_NAME;
const bot = new TelegramBot(token, {polling: true});
const currentGame = new Map();

bot.onText(new RegExp("^\\/gamestart(?:@${BOT_NAME})?( .*)?$", 'i'), (msg, match) => {
	const chatId = msg.chat.id;

	if(!match[1]) {
		match[1] = ' 4';
	}

	match[1] = parseInt(match[1].slice(1));

	if(!isFinite(match[1])) {
		bot.sendMessage(chatId, "Usage: /gamestart [length of letters]");
		return;
	}

	if(match[1] < 4) return reject(new Error("The length of text should be bigger than 3."));
	if(match[1] > 6) return reject(new Error("The length of text should be smaller than 7."));

	currentGame.set(chatId, match[1]);

	bot.sendMessage(chatId, `The exciting and fun javascript game has been started. Length: ${match[1]}`);
});

bot.onText(new RegExp("^\\/challenge(?:@${BOT_NAME})?( .*)?$", 'i'), (msg, match) => {
	const chatId = msg.chat.id;
	const messageId = msg.message_id;

	if(!currentGame.has(chatId)) {
		bot.sendMessage(chatId, "Please run /gamestart first!");
		return;
	}

	match[1] = match[1].slice(1);

	if(match[1] !== currentGame.get(chatId)) return bot.sendMessage(chatId, `Oops, Current length is ${match[1]}!`, {
		reply_to_message_id: messageId
	});

	checkLibrary(match[1]).then((result) => {
		if(result) {
			bot.sendMessage(chatId, `Whoa! There was a library named ${match[1]}!`, {
				reply_to_message_id: messageId
			});
		} else {
			bot.sendMessage(chatId, `Whoa! No library named ${match[1]} exists!`, {
				reply_to_message_id: messageId
			});
		}
	}).catch((err) => {
		bot.sendMessage(chatId, `Text should be consisted of alphabet!`, {
			reply_to_message_id: messageId
		});
	});

});
