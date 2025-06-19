// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'https://api.themoviedb.org/3'; 

export const fetchMovies = async (query) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search/movie`, {
      params: {
        api_key: process.env.REACT_APP_TMDB_API_KEY,
        query,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};
