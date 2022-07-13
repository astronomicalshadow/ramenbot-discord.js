const Discord = require('discord.js');
const token = require('./token.json');
const MessageHandler = require ('./MessageHandler.js');

const client = new Discord.Client(); // create a new Discord client

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