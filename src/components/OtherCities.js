import React from 'react';
import './OtherCities.css';

function OtherCities({ cities, unit, onCityClick }) {
  if (!cities || cities.length === 0) return null;

  const convertTemp = (tempC) => {
    if (unit === 'F') {
      return Math.round((tempC * 9 / 5) + 32);
    }
    return Math.round(tempC);
  };

  const getWeatherEmoji = (icon) => {
    if (icon.includes('01')) return '☀️';
    if (icon.includes('02')) return '⛅';
    if (icon.includes('03') || icon.includes('04')) return '☁️';
    if (icon.includes('09') || icon.includes('10')) return '🌧️';
    if (icon.includes('11')) return '⛈️';
    if (icon.includes('13')) return '❄️';
    if (icon.includes('50')) return '🌫️';
    return '🌤️';
  };

  const handleCityClick = (cityName) => {
    if (onCityClick) {
      onCityClick(cityName);
    }
  };

  return (
    <div className="other-cities">
      <h3 className="other-title">🌍 Other Cities</h3>
      <div className="other-grid">
        {cities.map((city, index) => (
          <div 
            key={index} 
            className="other-city-card"
            onClick={() => handleCityClick(city.name)}
            style={{ cursor: 'pointer' }}
          >
            <div className="other-city-header">
              <span className="other-city-name">{city.name}</span>
              <span className="other-city-emoji">{getWeatherEmoji(city.weather[0].icon)}</span>
            </div>
            <div className="other-city-weather">
              <p className="other-city-temp">{convertTemp(city.main.temp)}°{unit}</p>
              <p className="other-city-desc">{city.weather[0].main}</p>
            </div>
            <div className="other-city-details">
              <span>💧 {city.main.humidity}%</span>
              <span>💨 {Math.round(city.wind.speed * 3.6)} km/h</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OtherCities;