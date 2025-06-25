import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function HomePage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [popular, setPopular] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [username, setUsername] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);

  const [genre, setGenre] = useState('');
  const [minRating, setMinRating] = useState('');
  const [releaseYear, setReleaseYear] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedUserId = localStorage.getItem('userId');

    if (storedUsername && storedUserId) {
      setUsername(storedUsername);
      setShowWelcome(true);
      fetchRecommendations(storedUserId);
    } else {
      setShowWelcome(false);
    }
  }, []);

  const fetchRecommendations = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/movies/recommendations/${userId}`);
      setRecommendations(res.data);
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
    }
  };

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await axios.get(
          'https://api.themoviedb.org/3/movie/popular?api_key=0e270153670e833704776e8211efae7e'
        );
        setPopular(res.data.results.slice(0, 12));
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

  const handleFilter = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/movies/filter`, {
        params: { genre, minRating, releaseYear }
      });
      setResults(res.data);
    } catch (err) {
      console.error('Filter failed:', err);
    }
  };

  return (
    <div className="home-page" style={{ padding: '20px' }}>
      {/* 👋 Welcome Message */}
      {showWelcome && username && (
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
          🎉 Welcome, {username}! Search Movies and Get Recommendations!
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

      {/* 🎛️ Filters */}
      <h3>🎛️ Filters</h3>
      <div style={{ display: 'flex', gap: '10px', margin: '10px 0' }}>
        <select onChange={(e) => setGenre(e.target.value)}>
          <option value="">Select Genre</option>
          <option value="28">Action</option>
          <option value="35">Comedy</option>
          <option value="18">Drama</option>
          <option value="27">Horror</option>
        </select>
        <input type="number" placeholder="Min Rating (e.g. 7)" onChange={(e) => setMinRating(e.target.value)} />
        <input type="number" placeholder="Release Year" onChange={(e) => setReleaseYear(e.target.value)} />
        <button onClick={handleFilter}>Apply Filters</button>
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

      {/* 💡 Personalized Recommendations */}
      {recommendations.length > 0 && (
        <>
          <hr />
          <h2 style={{ color: 'green' }}>💡 Recommended For You</h2>
          <div className="recommendations">
            {recommendations.map((movie) => (
              <Link to={`/movie/${movie.id}`} key={movie.id}>
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
        </>
      )}
    </div>
  );
}

export default HomePage;
