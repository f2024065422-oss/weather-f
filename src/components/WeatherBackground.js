import React, { useEffect, useState } from 'react';
import './WeatherBackground.css';

function WeatherBackground({ weatherData, darkMode }) {
  const [backgroundClass, setBackgroundClass] = useState('clear-day');

  useEffect(() => {
    if (!weatherData) return;

    const weatherCondition = weatherData.weather[0].main.toLowerCase();
    const weatherDescription = weatherData.weather[0].description.toLowerCase();
    const timezoneOffset = weatherData.timezone || 0;

    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const cityTime = new Date(utcTime + (timezoneOffset * 1000));
    const hour = cityTime.getHours();

    const isDaytime = hour >= 6 && hour < 18;

    let time = 'day';
    if (hour >= 5 && hour < 8) time = 'morning';
    else if (hour >= 8 && hour < 17) time = 'day';
    else if (hour >= 17 && hour < 20) time = 'evening';
    else time = 'night';

    let weather = 'clear';
    let showSun = false;
    
    if (weatherCondition.includes('rain') || weatherCondition.includes('drizzle')) {
      weather = 'rainy';
    } else if (weatherCondition.includes('thunder') || weatherCondition.includes('storm')) {
      weather = 'stormy';
    } else if (weatherCondition.includes('snow')) {
      weather = 'snowy';
    } else if (weatherCondition.includes('cloud')) {
      if (weatherDescription.includes('few clouds') || weatherDescription.includes('scattered clouds')) {
        weather = 'cloudy-sun';
        showSun = isDaytime;
      } else {
        weather = 'cloudy';
      }
    } else if (weatherCondition.includes('clear') || weatherCondition.includes('sunny')) {
      weather = 'clear';
      showSun = isDaytime;
    } else if (weatherCondition.includes('mist') || weatherCondition.includes('fog') || weatherCondition.includes('haze')) {
      weather = 'foggy';
    } else {
      weather = 'clear';
      showSun = isDaytime;
    }

    let className = '';
    if (weather === 'clear') {
      className = `clear-${time}`;
    } else if (weather === 'cloudy-sun') {
      className = `cloudy-sun-${time}`;
    } else if (weather === 'cloudy') {
      className = `cloudy-${time}`;
    } else if (weather === 'rainy') {
      className = `rainy-${time}`;
    } else if (weather === 'stormy') {
      className = `stormy-${time}`;
    } else if (weather === 'snowy') {
      className = `snowy-${time}`;
    } else if (weather === 'foggy') {
      className = `foggy-${time}`;
    } else {
      className = `clear-${time}`;
    }

    setBackgroundClass(className);

    const sunElement = document.querySelector('.sun-container');
    if (sunElement) {
      sunElement.style.display = showSun ? 'flex' : 'none';
    }
  }, [weatherData]);

  const getDarkModeClass = () => {
    return darkMode ? 'dark-mode-bg' : '';
  };

  return (
    <div className={`weather-background ${backgroundClass} ${getDarkModeClass()}`}>
      <div className="weather-particles">
        {/* Sun - only shown when showSun is true */}
        <div className="sun-container">
          <div className="sun-core"></div>
          <div className="sun-glow-large"></div>
          <div className="sun-glow-medium"></div>
          <div className="sun-glow-small"></div>
          <div className="sun-rays">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="sun-ray-beam" style={{
                transform: `rotate(${i * 30}deg)`,
                animationDelay: `${i * 0.3}s`
              }}></div>
            ))}
          </div>
        </div>
        <div className="sun-horizon"></div>

        {/* Clouds with sun (small sun) */}
        <div className="sun-container cloudy-sun" style={{ display: 'none' }}>
          <div className="sun-core small"></div>
          <div className="sun-glow-small-cloudy"></div>
        </div>

        {backgroundClass.includes('rainy') && (
          <>
            {[...Array(60)].map((_, i) => (
              <div key={i} className="rain-drop" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`,
                opacity: 0.3 + Math.random() * 0.3
              }}></div>
            ))}
          </>
        )}
        
        {backgroundClass.includes('stormy') && (
          <>
            {[...Array(20)].map((_, i) => (
              <div key={i} className="lightning-flash" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${0.1 + Math.random() * 0.2}s`
              }}></div>
            ))}
            {[...Array(80)].map((_, i) => (
              <div key={`rain-${i}`} className="rain-drop heavy-rain" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 1.5}s`,
                animationDuration: `${0.3 + Math.random() * 0.4}s`
              }}></div>
            ))}
          </>
        )}

        {backgroundClass.includes('snowy') && (
          <>
            {[...Array(60)].map((_, i) => (
              <div key={i} className="snow-flake" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${4 + Math.random() * 3}s`,
                width: `${3 + Math.random() * 6}px`,
                height: `${3 + Math.random() * 6}px`
              }}></div>
            ))}
          </>
        )}

        {backgroundClass.includes('cloudy-sun') && (
          <>
            {[...Array(15)].map((_, i) => (
              <div key={i} className="cloud-small" style={{
                left: `${Math.random() * 100}%`,
                top: `${10 + Math.random() * 30}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${10 + Math.random() * 5}s`,
                width: `${60 + Math.random() * 80}px`,
                height: `${20 + Math.random() * 30}px`,
                opacity: 0.5 + Math.random() * 0.3
              }}></div>
            ))}
          </>
        )}

        {backgroundClass.includes('cloudy') && (
          <>
            {[...Array(20)].map((_, i) => (
              <div key={i} className="cloud-large" style={{
                left: `${Math.random() * 100}%`,
                top: `${5 + Math.random() * 40}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${12 + Math.random() * 8}s`,
                width: `${80 + Math.random() * 120}px`,
                height: `${30 + Math.random() * 40}px`,
                opacity: 0.6 + Math.random() * 0.3
              }}></div>
            ))}
          </>
        )}

        {backgroundClass.includes('night') && (
          <>
            {[...Array(50)].map((_, i) => (
              <div key={i} className="star" style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 80}%`,
                animationDelay: `${Math.random() * 3}s`,
                width: `${1 + Math.random() * 3}px`,
                height: `${1 + Math.random() * 3}px`
              }}></div>
            ))}
            <div className="moon-container">
              <div className="moon"></div>
              <div className="moon-glow"></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default WeatherBackground;