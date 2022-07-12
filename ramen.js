const Discord = require('discord.js');
const {prefix, token} = require('./config.json');
const YTMusic = require('./YTMusicbot.js')

// create a new Discord client
const client = new Discord.Client();

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
	if (message.author.bot) return;

	if (!message.content.startsWith(prefix)) 
	{
		const globalMessage = message.content.toLowerCase().slice(prefix.length).trim().split(/ +/);
		specialCommands(globalMessage);
		return;
	}

	commands(message, parceMessage(message));

});

function specialCommands(globalMessage) 
{
	switch (globalMessage)
	{
		case globalMessage.includes(`hungry`):
			message.channel.send(`Ramen`);
			break;
		case globalMessage.includes('ramen'):
			message.channel.send(`Ramen`);
			break;
		case globalMessage[0] === `i`:
			message.channel.send(globalMessage.join().substring(1));
			break;
	}
}

var parceMessage = (message) => 
{
	return message.content.slice(prefix.length).trim().split(/\s+/); // queue.get return undefined 
}

var commands = (message, parceMessage) => {

	switch (parceMessage[0].toLowerCase()) {
		case `play`:
			YTMusic.play(message, parceMessage);
			break;

		case `skip`:
			YTMusic.skip(message, parceMessage);
			break;

		case `stop`:
			YTMusic.stop(message, parceMessage);
			break;
			
		case `ping`:
			message.channel.send('Pong.');
			break;

		case `server`:
			message.channel.send(`This server's name is: ${message.guild.name}\n Total members: ${message.guild.memberCount}`);
			break;

		case `user-info`:
			message.channel.send(`Your username: ${message.author.username}\n Your ID: ${message.author.id}`);
			break;

		case `arguments`: // what does this do?
			if (!args.length) {
				return message.channel.send(`You didn't provide any arguments, @${message.author}`);
			}
			else if (args[0] === 'foo') {
				return message.channel.send('bar');
			}

			message.channel.send(`Command name: ${command}\nArguments: ${args}`);
			break;

		case `kick`:
			if (!message.mentions.users.size) {
				return message.reply('you need to tag a user in order to kick them!');
			}
			// grab the "first" mentioned user from the message
			// this will return a `User` object, just like `message.author`
			const taggedUser = message.mentions.users.first();

			message.channel.send(`You wanted to kick: ${taggedUser.username}`);
			break;

		case `avatar`:
			if (!message.mentions.users.size) {
				return message.channel.send(`Your avatar: <${message.author.displayAvatarURL({ format: "png", dynamic: true })}>`);
			}

			const avatarList = message.mentions.users.map(user => {
				return `${user.username}'s avatar: <${user.displayAvatarURL({ format: "png", dynamic: true })}>`;
			});

			// send the entire array of strings as a message
			// by default, discord.js will `.join()` the array with `\n`
			message.channel.send(avatarList);
			// ...
			break;
			/*
		case `delete`:
			const amount = parseInt(args[0]);

			const filter = message => message.author.id === message.author.id;
			const collector = message.channel.createMessageCollector(filter, { time: 1000 * 10 });

			collector.on('collect', message => {
				console.log(`Collected ${message.content}`);
			});

			collector.on('end', collected => {
				console.log(`Collected ${collected.size} items`);
			});

			deleteMessages(amount, message, collected);
			return;

			*/
		default:
			message.channel.send(`invalid command`);
			break;
	}
}

/*
// delete bulk messages

async function deleteMessages(amount, message, collector) {
	if (isNaN(amount)) {
		return message.reply('input amount');
	}
	if (amount === 1) {
		message.channel.bulkDelete(amount + 1);
		return;
	}
	else {
		try {
			if (amount > 100) {
				const invalidNumber = await message.channel.send(`must be less than 100`);
				await invalidNumber.delete({ timeout: 5000 });
				return;
			}
			await message.channel.send(`Do you want to delete ${amount} messages? Y/N`);
			await message.channel.awaitMessages({ max: 1, time: 10000 });
			if (collected === `Y`) {
				const messageDelete = await message.channel.send(`deleteing...`);
				await { timeout: 5000 };
				message.channel.bulkDelete(amount + 3);
			}
			else {
				const cancellingMessage = await message.channel.send(`cancelled`);
				await cancellingMessage.delete({ timeout: 5000 });
			}
		}
		catch {
			message.channel.send(`error`);
		}
		return;
	}
}
*/
// login to Discord with your app's token
client.login(token);