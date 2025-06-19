const axios = require('axios');
const User = require('../models/User');
require('dotenv').config();

const TMDB_API = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

exports.searchMovies = async (req, res) => {
  try {
    const { query } = req.query;
    const response = await axios.get(`${TMDB_API}/search/movie`, {
      params: { api_key: API_KEY, query }
    });
    res.json(response.data.results);
  } catch (err) {
    res.status(500).json({ error: 'TMDB search failed' });
  }
};

exports.addFavorite = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user.favorites.includes(req.body.movieId)) {
    user.favorites.push(req.body.movieId);
    await user.save();
  }
  res.json({ favorites: user.favorites });
};

exports.getFavorites = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ favorites: user.favorites });
};

exports.addToWatchlist = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user.watchlist.includes(req.body.movieId)) {
    user.watchlist.push(req.body.movieId);
    await user.save();
  }
  res.json({ watchlist: user.watchlist });
};

exports.getWatchlist = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ watchlist: user.watchlist });
};
