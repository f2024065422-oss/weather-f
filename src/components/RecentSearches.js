import React from 'react';
import './RecentSearches.css';

function RecentSearches({ searches, onSearchClick, onClear }) {
  return (
    <div className="recent-searches">
      <div className="recent-header">
        <h3>🕐 Recent Searches</h3>
        <button onClick={onClear} className="clear-button">Clear All</button>
      </div>
      <div className="recent-list">
        {searches.map((city, index) => (
          <button
            key={index}
            className="recent-item"
            onClick={() => onSearchClick(city)}
          >
            <span className="recent-icon">📍</span>
            {city}
          </button>
        ))}
      </div>
    </div>
  );
}

export default RecentSearches;