// Load environment variables
const dotenv = require('dotenv');
dotenv.config({ path: dotenv.config({ path: './.env' }).error ? '../.env' : './.env' });

// Requires
const Discord = require("discord.js");
const axios = require("axios");
const cerebrus6 = require("./cerebrus6/link.js");
const database_connection = require("./core/database_connection.js");
// const mysql = require("mysql2/promise");
// const bluebird = require("bluebird");

const db = new database_connection();

// Create Client
// const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] }, function(error));

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

/////////////////////////////////////////////////////////////////////////////////
// To enable consecutive axios get requests line
// const https = require("https");
// axios.defaults.httpsAgent = new https.Agent({ keepAlive: true });
// (async function() {
// axios.defaults.timeout = 30000;
// 	// let x = await axiosGetRequest('https://meme-api.herokuapp.com/gimme');
// 	// console.log(x.data.url);
// 	// let y = await axiosGetRequest('https://meme-api.herokuapp.com/gimme');		
// 	// console.log(y.data.url);
// }());
/////////////////////////////////////////////////////////////////////////////////

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

// Every module has a corresponding bot command that starts with !
let modules = {
	r: "",
	rng: require("./cerebrus6/rng.js"),
	safeBet: require("./cerebrus6/safeBet.js"),
	meme: require("./cerebrus6/meme.js"),
	person: require("./cerebrus6/person.js"),
	headline: require("./cerebrus6/headline.js"),
	todo: require("./cerebrus6/todo.js"),
}

var user_id = null;

client.on('messageCreate', async msg => {
	user_id = msg.author.id;
	let message = msg.content.split(" ");

	let commands = ["!meme", "!getHeadline", "!rng", "!headline", "!safeBet", "!person", "!todo"];
	if(commands.includes(message[0])) {
		let [command, params] = await processCommand(message);

		modules[command].call(this, msg, ...params);
	}
});

async function processCommand(message = ["!r"]) {
	let command = message[0].replace("!", "");
	let params = message.slice(1);

	let values = {
		'command': command,
		'params': params.join(','),
		'added_by': user_id,
		'added_on': new Date().toISOString().replace('T', ' ').slice(0, 19)
	}

	await db.insert('command_history', values);

	// if(command != "r") {
	// 	await updateVar("r", chosen_module);
	// } else {
	// 	// Get the latest command
	// 	command = await getVar("r");
	// }

	return [command, params];
}

// Login using the Client Token provided by Discord
client.login(process.env.CLIENT_TOKEN);