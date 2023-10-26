// Requires
require("dotenv").config();
const Discord = require("discord.js");
const axios = require("axios");
const cerebrus6 = require("./cerebrus6/link.js");
const mysql = require("mysql2/promise");
// const bluebird = require("bluebird");

// Create Client
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] }, function(error));

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
	headline: require("./cerebrus6/headline.js")
}

client.on('messageCreate', async msg => {
	let message = msg.content.split(" ");
	// msg.reply('reply');
	let commands = ["!meme", "!getHeadline", "!rng", "!r", "!headline", "!safeBet"];
	if(commands.includes(message[0])) {
		let chosenModule = message[0].replace("!", "");
		let arr = message.slice(1);
		if(chosenModule != "r") {
			modules.r = chosenModule;
			await updateVar("r", chosenModule);
		} else {
			modules.r = await getVar("r");			
		}
		modules[modules.r].call(this, msg, ...arr);
	}
});

// Login using the Client Token provided by Discord
client.login(process.env.CLIENT_TOKEN);

// name = Unique Key, content = Content
// The main table is composed only of two collumns (varName, varContent)
// Both collumns are composed of strings
async function updateVar(name, content) {
	// Connect to Database
	const connection = await mysql.createConnection({
		host: "localhost",
		user: "root",
		password: "",
		database: "discordbot"
	})

	// Execute query
	connection.execute("UPDATE main SET varContent = ? WHERE varName LIKE ?", [content, name]);

	// End connection
	await connection.end();
}

// Asynchronously get data from the main table of the database
async function getVar(name) {
	// Connect to database
	const connection = await mysql.createConnection({
		host: "localhost",
		user: "root",
		password: "",
		database: "discordbot"
		// Promise: bluebird
	})

	// Execute query
	const [rows, fields] = await connection.execute("SELECT * FROM main WHERE varName = ?", [name]);

	// End Connection
	await connection.end();

	// Return content
	return rows[0].varContent;
}