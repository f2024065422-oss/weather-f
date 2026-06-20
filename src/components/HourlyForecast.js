import React from 'react';
import './HourlyForecast.css';

function HourlyForecast({ data, unit }) {
  if (!data || !data.list) return null;

  const hourlyData = data.list.slice(0, 24);

  const convertTemp = (tempC) => {
    if (unit === 'F') {
      return Math.round((tempC * 9 / 5) + 32);
    }
    return Math.round(tempC);
  };

  const getHour = (timestamp) => {
    const hour = new Date(timestamp * 1000).getHours();
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}${ampm}`;
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

  const isCurrentHour = (timestamp) => {
    const now = new Date();
    const currentHour = now.getHours();
    const itemHour = new Date(timestamp * 1000).getHours();
    const currentDate = now.getDate();
    const itemDate = new Date(timestamp * 1000).getDate();
    return currentHour === itemHour && currentDate === itemDate;
  };

  return (
    <div className="hourly-forecast-container">
      <div className="hourly-forecast-header">
        <h3>⏰ Hourly Forecast</h3>
        <span className="hourly-forecast-sub">Next 24 hours</span>
      </div>

      <div className="hourly-forecast-scroll">
        {hourlyData.map((item, index) => {
          const isCurrent = isCurrentHour(item.dt);
          const hour = getHour(item.dt);
          const temp = convertTemp(item.main.temp);
          const emoji = getWeatherEmoji(item.weather[0].icon);
          const pop = Math.round((item.pop || 0) * 100);
          const windSpeed = Math.round(item.wind.speed * 3.6);
          const humidity = item.main.humidity;

          return (
            <div 
              key={index} 
              className={`hourly-forecast-item ${isCurrent ? 'current' : ''}`}
            >
              <div className="hourly-forecast-time">{hour}</div>
              <div className="hourly-forecast-icon">{emoji}</div>
              <div className="hourly-forecast-temp">{temp}°{unit}</div>
              <div className="hourly-forecast-details">
                <span className="hourly-forecast-precip">💧 {pop}%</span>
                <span className="hourly-forecast-wind">💨 {windSpeed}</span>
                <span className="hourly-forecast-humidity">💨 {humidity}%</span>
              </div>
              {isCurrent && (
                <div className="hourly-forecast-current-label">Now</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HourlyForecast;