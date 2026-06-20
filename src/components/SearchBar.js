import React, { useState, useEffect, useRef } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch, loading, darkMode }) {
  const [city, setCity] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : [];
  });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
      const updated = [city.trim(), ...recentSearches.filter(item => item !== city.trim())].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      setCity('');
      setIsOpen(false);
    }
  };

  const handleRecentClick = (cityName) => {
    onSearch(cityName);
    setIsOpen(false);
  };

  const handleDeleteRecent = (cityName, e) => {
    e.stopPropagation();
    const updated = recentSearches.filter(item => item !== cityName);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleClearAll = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onSearch(`${latitude},${longitude}`);
          setIsOpen(false);
        },
        (error) => {
          alert('Unable to get your location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="search-container">
      <button 
        ref={buttonRef}
        className="search-icon-btn"
        onClick={toggleDropdown}
        aria-label="Search"
      >
        🔍
      </button>

      {isOpen && (
        <div 
          ref={dropdownRef}
          className={`search-dropdown ${darkMode ? 'dark' : 'light'}`}
        >
          <form onSubmit={handleSubmit} className="search-form">
            <div className={`search-wrapper ${darkMode ? 'dark' : 'light'}`}>
              <input
                type="text"
                className={`search-input ${darkMode ? 'dark' : 'light'}`}
                placeholder="Enter city name..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={loading}
                autoFocus
              />
              <button 
                type="submit" 
                className="search-submit-btn"
                disabled={loading || !city.trim()}
              >
                {loading ? '...' : '→'}
              </button>
            </div>
          </form>

          <button 
            className={`location-option ${darkMode ? 'dark' : 'light'}`}
            onClick={handleLocationClick}
          >
            <span className="location-icon">📍</span>
            Use Current Location
          </button>

          {recentSearches.length > 0 && (
            <div className="recent-searches-dropdown">
              <div className="recent-header">
                <span className={`recent-title ${darkMode ? 'dark' : 'light'}`}>RECENT</span>
                <button 
                  className="clear-all-btn"
                  onClick={handleClearAll}
                >
                  Clear All
                </button>
              </div>
              <div className="recent-list">
                {recentSearches.map((cityName, index) => (
                  <div key={index} className="recent-item-wrapper">
                    <button
                      className={`recent-item ${darkMode ? 'dark' : 'light'}`}
                      onClick={() => handleRecentClick(cityName)}
                    >
                      <span className="recent-icon">🕐</span>
                      {cityName}
                    </button>
                    <button
                      className="recent-delete-btn"
                      onClick={(e) => handleDeleteRecent(cityName, e)}
                      aria-label="Delete"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;