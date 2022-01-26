const axios = require("axios");

async function meme(msg) {
	msg.channel.send("Here's your meme!");
	const img = await axiosGetRequest('https://meme-api.herokuapp.com/gimme');
	msg.channel.send(img.data.url);	
}

async function axiosGetRequest(url) {
	const response = await axios.get(url);
    return response;
}

module.exports = meme;