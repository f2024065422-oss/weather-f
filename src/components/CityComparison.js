import React, { useState } from 'react';
import axios from 'axios';
import './CityComparison.css';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY || 'your_api_key_here';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

function CityComparison({ unit }) {
  const [city1, setCity1] = useState('');
  const [city2, setCity2] = useState('');
  const [data1, setData1] = useState(null);
  const [data2, setData2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCityWeather = async (city, setData) => {
    try {
      const response = await axios.get(
        `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
      );
      setData(response.data);
      return true;
    } catch (err) {
      setError(`City "${city}" not found`);
      return false;
    }
  };

  const handleCompare = async (e) => {
    e.preventDefault();
    if (!city1.trim() || !city2.trim()) {
      setError('Please enter both city names');
      return;
    }

    setLoading(true);
    setError('');
    setData1(null);
    setData2(null);

    const success1 = await fetchCityWeather(city1, setData1);
    const success2 = await fetchCityWeather(city2, setData2);

    setLoading(false);
    if (!success1 || !success2) {
      setError('One or both cities not found. Please check spelling.');
    }
  };

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

  return (
    <div className="city-comparison-container">
      <h3 className="comparison-title">📊 Compare Cities</h3>
      <form onSubmit={handleCompare} className="comparison-form">
        <div className="comparison-inputs">
          <input
            type="text"
            className="comparison-input"
            placeholder="City 1 (e.g., New York)"
            value={city1}
            onChange={(e) => setCity1(e.target.value)}
          />
          <span className="comparison-vs">VS</span>
          <input
            type="text"
            className="comparison-input"
            placeholder="City 2 (e.g., London)"
            value={city2}
            onChange={(e) => setCity2(e.target.value)}
          />
        </div>
        <button type="submit" className="comparison-btn" disabled={loading}>
          {loading ? 'Comparing...' : 'Compare'}
        </button>
      </form>

      {error && <p className="comparison-error">{error}</p>}

      {data1 && data2 && (
        <div className="comparison-results">
          <div className="comparison-city">
            <h4>{data1.name}, {data1.sys?.country}</h4>
            <div className="comparison-weather">
              <span className="comparison-emoji">{getWeatherEmoji(data1.weather[0].icon)}</span>
              <span className="comparison-temp">{convertTemp(data1.main.temp)}°{unit}</span>
            </div>
            <div className="comparison-details">
              <span>💧 {data1.main.humidity}%</span>
              <span>💨 {Math.round(data1.wind.speed * 3.6)} km/h</span>
            </div>
          </div>
          <div className="comparison-vs-badge">VS</div>
          <div className="comparison-city">
            <h4>{data2.name}, {data2.sys?.country}</h4>
            <div className="comparison-weather">
              <span className="comparison-emoji">{getWeatherEmoji(data2.weather[0].icon)}</span>
              <span className="comparison-temp">{convertTemp(data2.main.temp)}°{unit}</span>
            </div>
            <div className="comparison-details">
              <span>💧 {data2.main.humidity}%</span>
              <span>💨 {Math.round(data2.wind.speed * 3.6)} km/h</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CityComparison;