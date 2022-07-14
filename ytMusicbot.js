const ytdl = require('ytdl-core'); // instead of downloading the entire video write a video buffer so that the song can be played sooner
const ytsr = require('ytsr');
const response = require('./MessageHandler.js');

// Song queue
const queue = new Map();

// youtube search - string
async function YtSrSearch (message, pages = 1) 
{
	searchResult = await ytsr(message, { pages: 1 });
	
	message.channel.send(await ytsr(message, { pages: pages }));
	messageCollector(message);

	const firstResultBatch = await ytsr('github', { pages: 1 });
	const secondResultBatch = ytsr.continueReq(firstResultBatch.continuation);
}

// music bot
async function SongList(message, parceMessage)
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
	
	const options =
	{
		limit: 1
	}

	const searchResults = await ytsr (parceMessage.slice(1).join(' '), options);

	console.log(searchResults.items[0].title)

	const song = 
	{
		title: searchResults.items[0].title,
		url: searchResults.items[0].url
	};

	const serverQueue = queue.get(message.guild.id);

	if (!serverQueue)
	{
		const queueContruct =
		{
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			playing: true,
		};
		// Setting the queue using our contract
		queue.set(message.guild.id, queueContruct);
		
		//Pushing the song to songs array
		queueContruct.songs.push(song);
		console.log(JSON.stringify(queueContruct.songs));

		try
		{
			// try to join voicechat and save connection into object
			queueContruct.connection = await voiceChannel.join(); // THIS IS NOT A FUNCTION GO READ THE DOC

			console.log(queueContruct.connection)
			
			// calling the play function to start a song
			play(queueContruct);
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

function play(serverQueue)
{
	console.log(serverQueue.songs);
	if (!serverQueue.songs) // why cant i do this? need to fix
	{
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}

	const dispatcher = serverQueue.connection

	.play (ytdl(serverQueue.songs.url))  // cannot read property 'play' of undefined

	.on("finish", () =>
	{
		serverQueue.songs.shift();
		SongList(queueContruct.connection, serverQueue.songs[0]); // queueContruct is not in scope
	})
	.on("error", error => console.error(error));

	dispatcher.setVolume(1);
	
	serverQueue.textChannel.send(`Now playing: ${song.title}`);
}

function skip(message, serverQueue) // needs to get song array 
{
	if (!message.memeber.voice.channel)
	{
		return message.channel.send ("You must be in the channel");
	}
	if (!serverQueue)
	{
		return message.channel.send("No songs to skip");
	}
	serverQueue.textChannel.send(`Skipped ${songs[0].title} Now playing: ${songs[1].title}`);
	serverQueue.songs.shift();
	play (message, serverQueue.songs[0]);
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
	serverQueue.connection.dispatcher.end(); // what is serverQueue?
}

// function YtSr ()
// {
// 	const searchResults = await ytsr(searchString, [options]);

// }

module.exports =
{
	SongList,
	skip,
	stop
}