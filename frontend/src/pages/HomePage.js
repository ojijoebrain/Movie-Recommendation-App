import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function HomePage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [popular, setPopular] = useState([]);
  const [showWelcome, setShowWelcome] = useState(false);

  // Check for welcome message flag
  useEffect(() => {
    const welcomeFlag = localStorage.getItem('welcome');
    if (welcomeFlag) {
      setShowWelcome(true);
      setTimeout(() => setShowWelcome(false), 90000); // hide after 5 sec
      localStorage.removeItem('welcome');
    }
  }, []);

  // Fetch popular movies on page load
  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await axios.get(
          'https://api.themoviedb.org/3/movie/popular?api_key=0e270153670e833704776e8211efae7e'
        );
        setPopular(res.data.results.slice(0, 1000));
      } catch (err) {
        console.error('Failed to fetch popular movies:', err);
      }
    };

    fetchPopular();
  }, []);

  const handleSearch = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/movies/search?query=${query}`);
      setResults(res.data);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  return (
    <div className="home-page" style={{ padding: '20px' }}>
      {/* 👋 Welcome Message */}
      {showWelcome && (
        <div
          style={{
            backgroundColor: '#dff0d8',
            color: 'red',
            padding: '10px',
            borderRadius: '5px',
            textAlign: 'center',
            marginBottom: '20px',
            fontWeight: 'bold'
          }}
        >
          🎉 Welcome to Flick - Search Movies and Get Recommendations!
        </div>
      )}

      {/* 🎬 Search Section */}
      <h2 style={{ textAlign: 'center', color: 'red' }}>🎬 Search Movies</h2>
      <div className="search-container">
        <input
          type="text"
          value={query}
          placeholder="Enter movie title..."
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* 🔍 Search Results */}
      {results.length > 0 && (
        <div className="results">
          <h3>🔍 Search Results</h3>
          {results.map((movie) => (
            <Link to={`/movie/${movie.id}`} key={movie.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="movie-card">
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    alt={movie.title}
                    style={{ borderRadius: '8px' }}
                  />
                ) : (
                  <div style={{ height: '300px', background: '#ccc', borderRadius: '8px' }}>
                    <p>No image</p>
                  </div>
                )}
                <h4>{movie.title}</h4>
                <p>{movie.release_date}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <hr />

      {/* 🔥 Popular Movies Section */}
      <h2 style={{ color: 'red' }}>🔥 Popular Movies</h2>
      <div className="popular-movies">
        {popular.map((movie) => (
          <Link to={`/movie/${movie.id}`} key={movie.id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="movie-card">
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
                style={{ borderRadius: '8px' }}
              />
              <h4>{movie.title}</h4>
              <p>{movie.release_date}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
