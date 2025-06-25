const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/user');
const auth = require('../middleware/auth');
require('dotenv').config();

const TMDB_API = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

// Search movies by title 
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;

        const response = await axios.get(`${TMDB_API}/search/movie`, {
            params: { api_key: API_KEY, query }
        });

        res.json(response.data.results);
    } catch (err) {
        console.error(err.message); 
        res.status(500).json({ error: 'TMDB search failed' });
    }
});

// Add favorite movie
router.post('/favorites', auth, async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user.favorites.includes(req.body.movieId)) {
        user.favorites.push(req.body.movieId);
        await user.save();
    }
    res.json({ favorites: user.favorites });
});

// Get user favorites 
router.get('/favorites', auth, async (req, res) => {
    const user = await User.findById(req.user.id);
    res.json({ favorites: user.favorites });
});

// Add movie to watchlist 
router.post('/watchlist', auth, async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user.watchlist.includes(req.body.movieId)) {
        user.watchlist.push(req.body.movieId);
        await user.save();
    }
    res.json({ watchlist: user.watchlist });
});

// Get user watchlist 
router.get('/watchlist', auth, async (req, res) => {
    const user = await User.findById(req.user.id);
    res.json({ watchlist: user.watchlist });
});

// Filter movies by genre, rating, release year
router.get('/filter', async (req, res) => {
    const { genre, minRating, releaseYear } = req.query;
    let url = `${TMDB_API}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc`;

    if (genre) url += `&with_genres=${genre}`;
    if (minRating) url += `&vote_average.gte=${minRating}`;
    if (releaseYear) url += `&primary_release_year=${releaseYear}`;

    try {
        const response = await axios.get(url);
        res.json(response.data.results);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch filtered movies' });
    }
});

module.exports = router;
