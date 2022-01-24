// Requires
require("dotenv").config();
const Discord = require("discord.js");
const axios = require("axios");

// Create Client
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const https = require("https");
axios.defaults.httpsAgent = new https.Agent({ keepAlive: true });

// (async function() {
// axios.defaults.timeout = 30000;

// To enable consecutive axios get requests

// 	// let x = await axiosGetRequest('https://meme-api.herokuapp.com/gimme');
// 	// console.log(x.data.url);
// 	// let y = await axiosGetRequest('https://meme-api.herokuapp.com/gimme');		
// 	// console.log(y.data.url);

// }());


client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async msg => {
	let message = msg.content;
	// msg.reply('reply');

	if(message === "!meme") {
		msg.channel.send("Here's your meme!");
		const img = await axiosGetRequest('https://meme-api.herokuapp.com/gimme');
		msg.channel.send(img.data.url);
	}

	if(message === "!getHeadline") {
		
	}

});

async function axiosGetRequest(url) {
	const response = await axios.get(url);
    return response;
}

client.login(process.env.CLIENT_TOKEN);
console.log(process.env.CLIENT_TOKEN);