// frontend/src/pages/FavoritesPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/movies/favorites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavorites(res.data.favorites);
    };
    fetchFavorites();
  }, []);

  return (
    <div className="favorites-page">
      <h2>Your Favorite Movies</h2>
      <ul>
        {favorites.map((movieId, index) => (
          <li key={index}>{movieId}</li>
        ))}
      </ul>
    </div>
  );
}

export default FavoritesPage;