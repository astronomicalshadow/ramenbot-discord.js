const { Client, Intents } = require('discord.js');
const token = require('./token.json'); // make a json file named "token.jason" and copy token inside
const MessageHandler = require ('./MessageHandler.js');

const Intent = new Intents();

Intent.add
(
	Intents.FLAGS.GUILDS,
	Intents.FLAGS.GUILD_MESSAGES,
	Intents.FLAGS.DIRECT_MESSAGES,
	Intents.FLAGS.GUILD_VOICE_STATES
);

const client = new Client({intents: Intent}); // create a new Discord client

client.once('ready', () => 
{
	console.log('Ready!');
});

client.once('disconnect', () => 
{
	console.log('Disconnect!');
});

client.on('message', async message => 
{
	MessageHandler.MessageHandler(message);
});
// login to Discord with your app's token
client.login(token);