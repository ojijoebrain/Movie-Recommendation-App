// frontend/src/pages/WatchlistPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function WatchlistPage() {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const fetchWatchlist = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/movies/watchlist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWatchlist(res.data.watchlist);
    };
    fetchWatchlist();
  }, []);

  return (
    <div className="watchlist-page">
      <h2>Your Watchlist</h2>
      <ul>
        {watchlist.map((movieId, index) => (
          <li key={index}>{movieId}</li>
        ))}
      </ul>
    </div>
  );
}

export default WatchlistPage;