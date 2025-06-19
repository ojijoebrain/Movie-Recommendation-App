// frontend/src/pages/MovieDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const token = localStorage.getItem('token');

  // Fetch movie details and trailer
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=0e270153670e833704776e8211efae7e`
        );
        setMovie(res.data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    const fetchTrailer = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=0e270153670e833704776e8211efae7e`
        );
        const trailer = res.data.results.find(
          (video) => video.type === 'Trailer' && video.site === 'YouTube'
        );
        if (trailer) {
          setTrailerKey(trailer.key);
        }
      } catch (error) {
        console.error('Error fetching trailer:', error);
      }
    };

    fetchMovie();
    fetchTrailer();
  }, [id]);

  const handleAddToFavorites = async () => {
    try {
      await axios.post(
        'http://localhost:5000/api/movies/favorites',
        { movieId: movie.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('✅ Added to Favorites');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to add to favorites');
    }
  };

  const handleAddToWatchlist = async () => {
    try {
      await axios.post(
        'http://localhost:5000/api/movies/watchlist',
        { movieId: movie.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('✅ Added to Watchlist');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to add to watchlist');
    }
  };

  if (!movie) return <p>Loading...</p>;

  return (
    <div className="movie-details" style={{ padding: '20px' }}>
      <h2>{movie.title}</h2>
      <p>{movie.overview}</p>
      <p>Release Date: {movie.release_date}</p>
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        style={{ borderRadius: '8px', maxWidth: '300px' }}
      />

      {/* Buttons for favorites/watchlist */}
      {token && (
        <div style={{ marginTop: '20px' }}>
          <button onClick={handleAddToFavorites} style={{ marginRight: '10px' }}>
            ❤️ Add to Favorites
          </button>
          <button onClick={handleAddToWatchlist}>📺 Add to Watchlist</button>
        </div>
      )}

      {/* YouTube Trailer */}
      {trailerKey && (
        <div style={{ marginTop: '30px' }}>
          <h3>🎬 Watch Trailer</h3>
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${trailerKey}`}
            title="Movie Trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  );
}

export default MovieDetails;
