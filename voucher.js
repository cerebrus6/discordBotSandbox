const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '!'; // Replace this with your bot's prefix

// This object will store the vouch data (user IDs and vouch counts)
const vouchData = {};

client.once('ready', () => {
    console.log('Bot is ready!');
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'vouch') {
        // Check if a user is mentioned
        const user = message.mentions.users.first();
        if (!user) {
            return message.reply('Please mention the user you want to vouch for.');
        }

        // Check if the user trying to vouch is the same as the mentioned user
        if (user.id === message.author.id) {
            return message.reply('You cannot vouch for yourself!');
        }

        // Update vouch count in vouchData object
        vouchData[user.id] = (vouchData[user.id] || 0) + 1;

        // Send vouch confirmation message
        message.channel.send(`${user.tag} has received a vouch! Total vouches: ${vouchData[user.id]}`);
    }
});

// Replace 'YOUR_BOT_TOKEN' with your actual bot token
client.login(process.env.CLIENT_TOKEN);