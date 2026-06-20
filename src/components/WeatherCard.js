import React, { useState, useEffect } from 'react';
import './WeatherCard.css';

function WeatherCard({ data, unit, onAddFavorite, onRemoveFavorite, isFavorite }) {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    if (!data) return;

    const timezoneOffset = data.timezone || 0;

    const updateTime = () => {
      const now = new Date();
      const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
      const cityTime = new Date(utcTime + (timezoneOffset * 1000));
      
      const options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };
      setCurrentTime(cityTime.toLocaleTimeString('en-US', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, [data]);

  if (!data) {
    return <div style={{ color: 'white', padding: '2rem' }}>No weather data available</div>;
  }

  const temp = data.main?.temp || 0;
  const humidity = data.main?.humidity || 0;
  const feelsLike = data.main?.feels_like || 0;
  const weather = data.weather?.[0] || { icon: '01d', description: 'Clear sky' };
  const windSpeed = data.wind?.speed || 0;
  const country = data.sys?.country || 'US';
  const name = data.name || 'Unknown';
  const sunrise = data.sys?.sunrise || 0;
  const sunset = data.sys?.sunset || 0;
  const weatherIcon = weather.icon || '01d';
  const weatherDescription = weather.description || 'Clear sky';

  const convertTemp = (tempC) => {
    if (unit === 'F') {
      return Math.round((tempC * 9 / 5) + 32);
    }
    return Math.round(tempC);
  };

  const getWeatherEmoji = () => {
    if (weatherIcon.includes('01')) return '☀️';
    if (weatherIcon.includes('02')) return '⛅';
    if (weatherIcon.includes('03') || weatherIcon.includes('04')) return '☁️';
    if (weatherIcon.includes('09') || weatherIcon.includes('10')) return '🌧️';
    if (weatherIcon.includes('11')) return '⛈️';
    if (weatherIcon.includes('13')) return '❄️';
    if (weatherIcon.includes('50')) return '🌫️';
    return '🌤️';
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '--:--';
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      onRemoveFavorite(name);
    } else {
      onAddFavorite(name);
    }
  };

  return (
    <div className="weather-card-main">
      <div className="weather-card-header">
        <div>
          <h2 className="city-name">{name}, {country}</h2>
          <p className="city-time">Current {currentTime}</p>
        </div>
        <div className="header-actions">
          <div className="weather-emoji-big">{getWeatherEmoji()}</div>
          <button
            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
            onClick={handleFavoriteToggle}
          >
            {isFavorite ? '⭐' : '☆'}
          </button>
        </div>
      </div>

      <div className="weather-main-display">
        <div className="temp-section">
          <span className="temp-value-big">{convertTemp(temp)}</span>
          <span className="temp-unit-big">°{unit}</span>
        </div>
        <div className="weather-condition">
          <p className="weather-desc">{weatherDescription}</p>
          <p className="feels-like">Feels like {convertTemp(feelsLike)}°{unit}</p>
        </div>
      </div>

      <div className="weather-stats">
        <div className="stat-item">
          <span className="stat-icon">💧</span>
          <div>
            <span className="stat-label">Humidity</span>
            <span className="stat-value">{humidity}%</span>
          </div>
        </div>
        <div className="stat-item">
          <span className="stat-icon">💨</span>
          <div>
            <span className="stat-label">Wind Speed</span>
            <span className="stat-value">{Math.round(windSpeed * 3.6)} km/h</span>
          </div>
        </div>
        <div className="stat-item">
          <span className="stat-icon">🌅</span>
          <div>
            <span className="stat-label">Sunrise</span>
            <span className="stat-value">{formatTime(sunrise)}</span>
          </div>
        </div>
        <div className="stat-item">
          <span className="stat-icon">🌇</span>
          <div>
            <span className="stat-label">Sunset</span>
            <span className="stat-value">{formatTime(sunset)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;