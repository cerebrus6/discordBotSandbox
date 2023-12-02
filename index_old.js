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

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"] });

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
	// r: "",
	rng: require("./cerebrus6/rng.js"),
	safeBet: require("./cerebrus6/safeBet.js"),
	meme: require("./cerebrus6/meme.js"),
	person: require("./cerebrus6/person.js"),
	cat: require("./cerebrus6/cat.js"),
	waifu: require("./cerebrus6/waifu.js"),
	headline: require("./cerebrus6/headline.js"),
	todo: require("./cerebrus6/todo.js"),
	tini: require("./cerebrus6/tini.js"),
	fantasy: require("./cerebrus6/fantasy.js"),
	snack: require("./cerebrus6/snack.js"),
	joke: require("./cerebrus6/joke.js"),
	help: help,
}

function help(msg, command = null) {
	if(!command) {
		let guide_message = `\`\`\`Commands [Parameters]\`\`\``;

		for (const [command, function_obj] of Object.entries(modules)) {
			const fnString = function_obj.toString();
			const parameterNames = fnString
				.slice(fnString.indexOf('(') + 1, fnString.indexOf(')'))
				.split(', ')
				.filter(Boolean);
			parameterNames ? parameterNames.shift() : [];
			guide_message += `\`\`\`!${command} [${parameterNames.join('] [')}]\`\`\``
		}
		guide_message += `\nTo have details of a specific command, just input \`!help [command_name]\`\n`
		guide_message += `Note: Ignore the square brackets when typing the parameters.`
		msg.channel.send(guide_message);		
	}
}

client.on('messageCreate', async msg => {
	console.log(msg.channel.type);
	console.log("HEHEHEHE");
	user_id = msg.author.id;
	let message = msg.content.split(" ");

	// let commands = ["!meme", "!getHeadline", "!rng", "!headline", "!safeBet", "!person", "!todo", "!tini"];
	let commands = Object.keys(modules).map(key => `!${key}`);
	
	if(commands.includes(message[0])) {
		let [command, params] = await processCommand(message);

		modules[command] ? modules[command].call(this, msg, ...params) : msg.channel.send("Invalid Command");
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