import React from 'react';
import './Favorites.css';

function Favorites({ favorites, onCityClick, onRemoveFavorite }) {
  if (favorites.length === 0) return null;

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <h3>⭐ Favorites</h3>
      </div>
      <div className="favorites-list">
        {favorites.map((city, index) => (
          <div key={index} className="favorite-item">
            <button 
              className="favorite-city-btn"
              onClick={() => onCityClick(city)}
            >
              ⭐ {city}
            </button>
            <button 
              className="favorite-remove-btn"
              onClick={() => onRemoveFavorite(city)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Favorites;