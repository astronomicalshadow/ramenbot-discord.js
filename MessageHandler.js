const prefix = require('./config.json');

let MessageHandler = (message) =>
{
	if (message.author.bot) return;

	if (!message.content.startsWith(prefix)) 
	{
		const GlobalMessage = message.content.toLowerCase().slice(prefix.length);

		SpecialCommands(GlobalMessage, message);

		return;
	}

	command(message);
}

let SpecialCommands = (GlobalMessage, message) => // messages without prefix
{
	switch (GlobalMessage)
	{
		case GlobalMessage.includes(`hungry`):

			message.channel.send(`Ramen`);

			break;

		case GlobalMessage.includes('ramen'):

			message.channel.send(`Ramen`);

			break;

		case GlobalMessage[0] === `i`:

			message.channel.send(GlobalMessage.join().substring(1));

			break;

		default:

			break;
	}
}

let command = (message) => {

	let parceMessage = (message) => // string into array of words
	{
		return message.content.slice(prefix.length).trim().split(/\s+/); // queue.get return undefined 
	}

	switch (parceMessage[0].toLowerCase()) { // list of commands
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
				return message.channel.send(`Your avatar: < ${message.author.displayAvatarURL({ format: "png", dynamic: true })}>`);
			}

			const avatarList = message.mentions.users.map(user => {
				return `${user.username}'s avatar: < ${user.displayAvatarURL({ format: "png", dynamic: true })}>`;
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

// message collector 
async function AwaitResponse (message, max = 1, time_out = 20000, errors = ['time']) 
{
	// Errors: ['time'] treats ending because of the time limit as an error
	message.channel.awaitMessages({ filter: message => message.content.startsWith(prefix), max: max, time: time_out, errors: errors })
	
	.then(collected => {return collected})

	.catch(collected => message.channel.send (`timed out`));
}

process.on // all async error here
(
	'unhandledRejection', (error, obj) => 
	{
	// console.log('An unhandledRejection occurred');
	console.log(`Rejected Promise: ${obj}`);
	
	console.log(`Rejection: ${error}`);
	}
);