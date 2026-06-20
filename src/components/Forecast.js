import React, { useState } from 'react';
import './Forecast.css';

function Forecast({ data, unit, days = 7 }) {
  const [selectedDay, setSelectedDay] = useState(0);

  if (!data || !data.list) return null;

  let dailyForecasts = data.list.filter((item, index) => index % 8 === 0);

  if (dailyForecasts.length > days) {
    dailyForecasts = dailyForecasts.slice(0, days);
  }

  const convertTemp = (tempC) => {
    if (unit === 'F') {
      return Math.round((tempC * 9 / 5) + 32);
    }
    return Math.round(tempC);
  };

  const getDayName = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  };

  const getFullDayName = (date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
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

  const getHourlyForDay = (dayIndex) => {
    const startIndex = dayIndex * 8;
    return data.list.slice(startIndex, startIndex + 8);
  };

  const getHour = (timestamp) => {
    const hour = new Date(timestamp * 1000).getHours();
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}${ampm}`;
  };

  const handleDayClick = (index) => {
    setSelectedDay(index === selectedDay ? -1 : index);
  };

  const selectedHourlyData = selectedDay >= 0 ? getHourlyForDay(selectedDay) : [];

  const availableDays = dailyForecasts.length;

  return (
    <div className="forecast-container">
      <div className="forecast-header">
        <h3>📅 {days}-Day Forecast</h3>
        <span className="forecast-sub">
          {availableDays} days available
          {availableDays < days && ` (OpenWeatherMap free tier provides ${availableDays} days)`}
        </span>
      </div>

      <div className="forecast-horizontal-scroll">
        {dailyForecasts.map((item, index) => {
          const date = new Date(item.dt * 1000);
          const dayName = getDayName(date);
          const isSelected = selectedDay === index;
          const dayNumber = date.getDate();

          return (
            <div
              key={index}
              className={`forecast-day-horizontal ${isSelected ? 'selected' : ''}`}
              onClick={() => handleDayClick(index)}
            >
              <div className="forecast-day-name">{dayName}</div>
              <div className="forecast-day-date">{dayNumber}</div>
              <div className="forecast-day-icon">{getWeatherEmoji(item.weather[0].icon)}</div>
              <div className="forecast-day-temps-horizontal">
                <span className="forecast-day-high">{convertTemp(item.main.temp_max)}°</span>
                <span className="forecast-day-low">{convertTemp(item.main.temp_min)}°</span>
              </div>
              <div className="forecast-day-precip-horizontal">
                <span>💧 {Math.round((item.pop || 0) * 100)}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {selectedDay >= 0 && selectedHourlyData.length > 0 && (
        <div className="hourly-detail-container">
          <div className="hourly-detail-header">
            <h4>Hourly Forecast for {getFullDayName(new Date(dailyForecasts[selectedDay].dt * 1000))}</h4>
            <button className="hourly-close-btn" onClick={() => setSelectedDay(-1)}>✕</button>
          </div>
          <div className="hourly-detail-scroll">
            {selectedHourlyData.map((item, idx) => (
              <div key={idx} className="hourly-detail-item">
                <div className="hourly-detail-time">{getHour(item.dt)}</div>
                <div className="hourly-detail-icon">{getWeatherEmoji(item.weather[0].icon)}</div>
                <div className="hourly-detail-temp">{convertTemp(item.main.temp)}°{unit}</div>
                <div className="hourly-detail-info">
                  <span>💧 {item.main.humidity}%</span>
                  <span>💨 {Math.round(item.wind.speed * 3.6)} km/h</span>
                </div>
                <div className="hourly-detail-precip">
                  <div className="precip-bar">
                    <div 
                      className="precip-bar-fill" 
                      style={{ width: `${Math.round((item.pop || 0) * 100)}%` }}
                    ></div>
                  </div>
                  <span>{Math.round((item.pop || 0) * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Forecast;