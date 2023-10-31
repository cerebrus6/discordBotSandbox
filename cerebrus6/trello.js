require("dotenv").config();
const axios = require('axios');

const api_key = process.env.TRELLO_API_KEY;
const api_token = process.env.TRELLO_API_TOKEN;

// Set up the base URL for Trello API
const apiUrl = 'https://api.trello.com/1';

async function getCardsForList(list_id) {
  const response = axios.get(`${apiUrl}/lists/${list_id}/cards?key=${api_key}&token=${api_token}`)
  return response ? response.data : [];
}

async function getListsForBoard(board_id) {
  	const response = axios.get(`${apiUrl}/boards/${board_id}/lists?key=${api_key}&token=${api_token}`)
	return response ? response.data : [];
}

async function getBoardsForUser() {
  const response = axios.get(`${apiUrl}/members/me/boards?key=${api_key}&token=${api_token}`)
  return response ? response.data : [];
}

module.exports = {
	getCardsForList,
	getListsForBoard,
	getBoardsForUser
}