import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import SearchBar from './SearchBar';
import WeatherCard from './WeatherCard';
import Forecast from './Forecast';
import HourlyForecast from './HourlyForecast';
import OtherCities from './OtherCities';
import Favorites from './Favorites';
import WeatherBackground from './WeatherBackground';
import BottomNav from './BottomNav';
import WindCompass from './WindCompass';
import TemperatureChart from './TemperatureChart';
import CityComparison from './CityComparison';
import AQIDisplay from './AQIDisplay';
import WeatherMap from './WeatherMap';
import './WeatherDashboard.css';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY || 'your_api_key_here';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';
const AQI_URL = 'https://api.openweathermap.org/data/2.5/air_pollution';

function WeatherDashboard({ setError, darkMode, settings, onToggleDarkMode, onOpenSettings }) {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [unit, setUnit] = useState('C');
  const [otherCitiesData, setOtherCitiesData] = useState([]);
  const [locationLoaded, setLocationLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('today');
  const [aqiData, setAqiData] = useState(null);
  const [cityCoords, setCityCoords] = useState({ lat: 0, lon: 0 });

  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error('Error loading favorites:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (settings?.unit) {
      setUnit(settings.unit);
    }
  }, [settings]);

  const fetchOtherCities = useCallback(async () => {
    const cities = ['Los Angeles', 'Dallas', 'San Jose', 'Miami', 'Las Vegas'];
    try {
      const promises = cities.map(city =>
        axios.get(`${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`)
      );
      const responses = await Promise.all(promises);
      setOtherCitiesData(responses.map(r => r.data));
    } catch (error) {
      console.error('Error fetching other cities:', error);
    }
  }, []);

  const fetchAQI = useCallback(async (lat, lon) => {
    try {
      const response = await axios.get(
        `${AQI_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      setAqiData(response.data.list[0].main.aqi);
    } catch (error) {
      console.error('Error fetching AQI:', error);
    }
  }, []);

  const fetchWeather = useCallback(async (city) => {
    if (!city || !city.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setWeatherData(null);
    setForecastData(null);
    setError(null);

    try {
      let response;
      let cityName = city.trim();

      if (city.includes(',')) {
        const [lat, lon] = city.split(',').map(Number);
        response = await axios.get(
          `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        setCityCoords({ lat, lon });
        fetchAQI(lat, lon);
        try {
          const geoResponse = await axios.get(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
          );
          if (geoResponse.data && geoResponse.data.length > 0) {
            cityName = geoResponse.data[0].name;
          }
        } catch (geoError) {
          console.error('Error fetching city name:', geoError);
        }
      } else {
        response = await axios.get(
          `${BASE_URL}?q=${encodeURIComponent(city.trim())}&appid=${API_KEY}&units=metric`
        );
        try {
          const geoResponse = await axios.get(
            `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city.trim())}&limit=1&appid=${API_KEY}`
          );
          if (geoResponse.data && geoResponse.data.length > 0) {
            const { lat, lon } = geoResponse.data[0];
            setCityCoords({ lat, lon });
            fetchAQI(lat, lon);
          }
        } catch (geoError) {
          console.error('Error fetching coordinates:', geoError);
        }
      }
      setWeatherData(response.data);

      const forecastResponse = await axios.get(
        `${FORECAST_URL}?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`
      );
      setForecastData(forecastResponse.data);
      
      fetchOtherCities();
      
    } catch (error) {
      console.error('Fetch error:', error);
      if (error.response) {
        if (error.response.status === 404) {
          setError('City not found. Please check the spelling.');
        } else if (error.response.status === 401) {
          setError('Invalid API key. Please check your configuration.');
        } else {
          setError('Failed to fetch weather data. Please try again.');
        }
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  }, [setError, fetchOtherCities, fetchAQI]);

  const getCurrentLocationWeather = useCallback(() => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCityCoords({ lat: latitude, lon: longitude });
          try {
            const response = await axios.get(
              `${BASE_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
            );
            setWeatherData(response.data);
            fetchAQI(latitude, longitude);

            const forecastResponse = await axios.get(
              `${FORECAST_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
            );
            setForecastData(forecastResponse.data);
            setLocationLoaded(true);
            fetchOtherCities();
          } catch (error) {
            setError('Failed to fetch weather for your location.');
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          setLoading(false);
          fetchWeather('London');
        }
      );
    } else {
      fetchWeather('London');
    }
  }, [setError, fetchOtherCities, fetchWeather, fetchAQI]);

  useEffect(() => {
    if (!locationLoaded) {
      getCurrentLocationWeather();
    }
  }, [locationLoaded, getCurrentLocationWeather]);

  const addFavorite = (city) => {
    if (!favorites.includes(city)) {
      setFavorites([...favorites, city]);
    }
  };

  const removeFavorite = (city) => {
    setFavorites(favorites.filter(item => item !== city));
  };

  const handleFavoriteClick = (city) => {
    setActiveTab('today');
    fetchWeather(city);
  };

  const handleOtherCityClick = (cityName) => {
    setActiveTab('today');
    fetchWeather(cityName);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'today':
        return (
          <>
            {weatherData && (
              <WeatherCard 
                data={weatherData} 
                unit={unit}
                onAddFavorite={addFavorite}
                onRemoveFavorite={removeFavorite}
                isFavorite={favorites.includes(weatherData.name)}
              />
            )}
            
            {forecastData && (
              <HourlyForecast data={forecastData} unit={unit} />
            )}
            
            {forecastData && (
              <Forecast 
                data={forecastData} 
                unit={unit}
                days={settings?.forecastDays || 7}
              />
            )}
            
            {settings?.showWindCompass !== false && weatherData && (
              <WindCompass 
                windSpeed={weatherData.wind?.speed || 0} 
                windDeg={weatherData.wind?.deg || 0} 
              />
            )}
            
            {settings?.showAQI !== false && aqiData && (
              <AQIDisplay aqi={aqiData} />
            )}
            
            {settings?.showMap !== false && weatherData && cityCoords.lat && cityCoords.lon && (
              <WeatherMap 
                city={weatherData.name} 
                lat={cityCoords.lat} 
                lon={cityCoords.lon} 
              />
            )}
            
            {settings?.showOtherCities !== false && otherCitiesData.length > 0 && (
              <OtherCities 
                cities={otherCitiesData} 
                unit={unit}
                onCityClick={handleOtherCityClick}
              />
            )}
          </>
        );
        
      case 'hourly':
        return forecastData ? (
          <HourlyForecast data={forecastData} unit={unit} />
        ) : (
          <div className="no-data-message">No hourly forecast available</div>
        );
        
      case 'forecast':
        return forecastData ? (
          <>
            <Forecast 
              data={forecastData} 
              unit={unit}
              days={settings?.forecastDays || 7}
            />
            <TemperatureChart data={forecastData} unit={unit} />
          </>
        ) : (
          <div className="no-data-message">No forecast data available</div>
        );
        
      case 'favorites':
        return favorites.length > 0 ? (
          <Favorites 
            favorites={favorites}
            onCityClick={handleFavoriteClick}
            onRemoveFavorite={removeFavorite}
          />
        ) : (
          <div className="no-data-message">⭐ No favorite cities yet. Add some!</div>
        );
        
      case 'map':
        return settings?.showMap !== false && cityCoords.lat && cityCoords.lon ? (
          <WeatherMap 
            city={weatherData?.name || 'Current Location'} 
            lat={cityCoords.lat} 
            lon={cityCoords.lon} 
          />
        ) : (
          <div className="no-data-message">Map not available</div>
        );
        
      case 'compare':
        return <CityComparison unit={unit} />;
        
      default:
        return null;
    }
  };

  return (
    <div className={`weather-dashboard ${darkMode ? 'dark' : 'light'}`}>
      <WeatherBackground weatherData={weatherData} darkMode={darkMode} />
      
      <div className="dashboard-controls">
        <div className="controls-left">
          <h1 className="dashboard-title">🌤️ Weather</h1>
        </div>
        <div className="controls-right">
          <SearchBar onSearch={fetchWeather} loading={loading} darkMode={darkMode} />
          <button 
            className="settings-btn"
            onClick={onOpenSettings}
            title="Settings"
          >
            ⚙️
          </button>
          <button 
            className="theme-toggle"
            onClick={onToggleDarkMode}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      <div className="menu-bar">
        <button 
          className={`menu-item ${activeTab === 'today' ? 'active' : ''}`}
          onClick={() => handleTabChange('today')}
        >
          📊 Today
        </button>
        <button 
          className={`menu-item ${activeTab === 'hourly' ? 'active' : ''}`}
          onClick={() => handleTabChange('hourly')}
        >
          ⏰ Hourly
        </button>
        <button 
          className={`menu-item ${activeTab === 'forecast' ? 'active' : ''}`}
          onClick={() => handleTabChange('forecast')}
        >
          📅 Forecast
        </button>
        <button 
          className={`menu-item ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => handleTabChange('favorites')}
        >
          ⭐ Favorites
        </button>
        <button 
          className={`menu-item ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => handleTabChange('map')}
        >
          🗺️ Map
        </button>
        <button 
          className={`menu-item ${activeTab === 'compare' ? 'active' : ''}`}
          onClick={() => handleTabChange('compare')}
        >
          📊 Compare
        </button>
      </div>
      
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading weather data...</p>
        </div>
      )}
      
      {!loading && renderContent()}

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}

export default WeatherDashboard;