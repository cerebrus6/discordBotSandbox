async function main() {
	// Requires
	require("dotenv").config();

	/////////////////////////////////////////////////////////////////////////////////
	// Connect to Discord
	const Discord = require("discord.js");
	const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
	const common = require("./core/common.js");
	client.login(process.env.CLIENT_TOKEN);	// Login using the Client Token provided by Discord
	/////////////////////////////////////////////////////////////////////////////////

	/////////////////////////////////////////////////////////////////////////////////
	// Establish database connection
	const database_connection = require('./core/database_connection.js');
	const db = new database_connection();
	/////////////////////////////////////////////////////////////////////////////////

	/////////////////////////////////////////////////////////////////////////////////
	// Import bot commands
	const axios = require("axios");
	const cerebrus6 = require("./cerebrus6/link.js");
	/////////////////////////////////////////////////////////////////////////////////

	var sql, binds, res, where, values, user;

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

	// Example usage

	client.on('ready', () => {
		// console.log(client.user);
		console.log(`Logged in as ${client.user.tag}!`);
	});

	// Every module has a corresponding bot command that starts with !
	let modules = {
		r: "",
		rng: require("./cerebrus6/rng.js"),
		safeBet: require("./cerebrus6/safeBet.js"),
		meme: require("./cerebrus6/meme.js"),
		person: require("./cerebrus6/person.js"),
		headline: require("./cerebrus6/headline.js")
	}

	client.on('messageCreate', async msg => {
		let message = msg.content.split(" ");

		where = {
			'id =': msg.author.id,
			'username =': msg.author.username,
			'is_deleted =': 0
		}

		console.log(msg.author);

		// Add user in database if it doesn't exist
		user = await db.select('user_account', '' , where, null) ?? [];
		if(user.length === 0) {
			values = {
				'id': msg.author.id,
				'username': msg.author.username,
				'avatar': msg.author.avatar,
				'avatar_url': 'https://cdn.discordapp.com/avatars/' + msg.author.id +'/' + msg.author.avatar + '.png',
				'added_by': msg.author.id,
				'added_on': common.currentDateTime(),
			}

			await db.insert("user_account", values);
		}

		let commands = ["!meme", "!getHeadline", "!rng", "!r", "!headline", "!safeBet", "!person"];

		if(commands.includes(message[0])) {
			let chosen_module = message[0].replace("!", "");

			let arr = message.slice(1) ?? [];
			if(chosen_module != "r") {
				modules.r = chosen_module;
				where = {
					'name =': 'r'
				}

				values = {
					'value': modules.r,
					// 'params': arr.join(','),
					'updated_by': msg.author.id,
					'updated_on': common.currentDateTime(),
				}
				await db.update("main", where, values);
			} else {
				where = {
					'is_deleted =': 0
				}
				let r = await db.select('command_history', '', where, 'id DESC', 1);
				modules.r = r.command;
				arr = r.params ? r.params.split(',') : [];
			}

			values = {
				'command': modules.r,
				'params': arr.join(','),
				'added_by': msg.author.id,
				'added_on': common.currentDateTime(),
			}

			await db.insert("command_history", values);
			modules[modules.r].call(this, msg, ...arr);
		}
	});	
}

try {
	main();
	// Write errors to file
} catch (error) {
    const fs = require('fs');
    const logDirectory = '../logs';

    if (!fs.existsSync(logDirectory)) {
        fs.mkdirSync(logDirectory);
    }

    const currentDate = new Date().toISOString().split('T')[0];
    const timestamp = new Date().toLocaleString();
    const logMessage = `${timestamp}: ${error}\n`;

    const logFileName = `${logDirectory}/error_${currentDate}.log`;

    fs.appendFile(logFileName, logMessage, (err) => {
        if (err) {
            console.error('Error writing to log file: ' + err);
        }
    });
}