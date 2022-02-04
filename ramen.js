// require the discord.js module
//const toMP3 = require ('toMP3.js');

const Discord = require('discord.js');
const {prefix, token} = require('./config.json');
const ytdl = require('ytdl-core');
const { getInfo } = require('ytdl-core');

// create a new Discord client
const client = new Discord.Client();

// Song queue
const queue = new Map();

// when the client is ready, run this code
// this event will only trigger one time after logging in
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
		const globalMessage = message.content.slice(prefix.length).trim().split(/ +/).toLowerCase();
		specialCommands(globalMessage);
		return;
	}

	commands(message, parceMessage());

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
	return [message.content.slice(prefix.length).trim().split(/ +/).shift().toLowerCase(),  queue.get(message.guild.id)];
}

var commands = (message, parceMessage) => {
	switch (parceMessage[0][0]) {
		case `play`:
			execute(message, parceMessage);
			break;
		case `skip`:
			skip(message, parceMessage);
			break;
		case `stop`:
			stop(message, parceMessage);
			break;
		case `ping`:
			message.channel.send('Pong.');
			break;
		case `beep`:
			message.channel.send('Boop.');
			break;
		case `server`:
			message.channel.send(`This server's name is: ${message.guild.name}\n Total members: ${message.guild.memberCount}`);
			break;
		case `user-info`:
			message.channel.send(`Your username: ${message.author.username}\n Your ID: ${message.author.id}`);
			break;
		case `arguments`:
			if (!args.length) {
				return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
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

// music bot
async function execute(message, parceMessage)
{
	const voiceChannel = message.member.voice.channel;
	if (!voiceChannel)
	{
		return message.channel.send ("You need to be in a voice channel");
	}

	const permissions = voiceChannel.permissionsFor(message.client.user);
	if(!permissions.has("CONNECT") || !permissions.has("SPEAK"))
	{
		return message.channel.send ("Need permissions to join and speak");
	}

	const songInfo = await getInfo(parceMessage[0][1]);

	const song = 
	{
		title: songInfo.videoDetails.title,
		url: songInfo.videoDetails.video_url,
	}

	if (!serverQueue)
	{
		const queueContruct =
		{
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 2,
			playing: true,
		};
		
		// Setting the queue using our contract
		queue.set(message.guild.id, queueContruct);
		
		//Pushing the song to songs array
		queueContruct.songs.push(song);

		try
		{
			// try to join voicechat and save connection into object
			var connection = await voiceChannel.join();
			queueContruct.connection = connection;
			// calling the play function to start a song
			play(message.guild, queueContruct.songs[0]);
		}
		catch (err)
		{
			console.log(err);
			queue.delete(message.guild.id);
			return message.channel.send(err.toString());
		}
	}
	else
	{
		serverQueue.songs.push(song);
		return message.channel.send(`${song.title} has been added to queue`)
	}
}


function play(guild, song)
{
	const serverQueue = queue.get(guild.id);
	if (!song)
	{
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}

	const dispatcher = serverQueue.connection
	.play (ytdl(song.url))
	.on("finish", () =>
	{
		serverQueue.songs.shift();
		play(guild,serverQueue.songs[0]);
	})
	.on("error", error => console.error(error));

	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
	
	serverQueue.textChannel.send(`Now playing: ${song.title}`);
}

function skip(message, serverQueue)
{
	if (!message.memeber.voice.channel)
	{
		return message.channel.send ("You must be in the channel");
	}
	if (!serverQueue)
	{
		return message.channel.send("No songs to skip");
	}
	serverQueue.connection.dispatcher.end();
}

function stop (message, serverQueue)
{
	if (!message.member.voice.channel)
	{
		return message.channel.send ("You must be in the channel");
	}

	if (!serverQueue)
	{
		return message.channel.send("No song to stop");
	}

	serverQueue.songs = [];
	serverQueue.connection.dispatcher.end();
}

// Unhandled promise
process.on('unhandledRejection', (err, p) => {
	// console.log('An unhandledRejection occurred');
	console.log(`Rejected Promise: ${p}`);
	console.log(`Rejection: ${err}`);
  });


// login to Discord with your app's token
client.login(token);





