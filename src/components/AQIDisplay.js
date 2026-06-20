import React from 'react';
import './AQIDisplay.css';

function AQIDisplay({ aqi }) {
  if (!aqi) return null;

  const getAQIInfo = (value) => {
    if (value <= 50) return { label: 'Good', color: '#00e400', emoji: '😊' };
    if (value <= 100) return { label: 'Moderate', color: '#ffff00', emoji: '🙂' };
    if (value <= 150) return { label: 'Unhealthy for Sensitive Groups', color: '#ff7e00', emoji: '😷' };
    if (value <= 200) return { label: 'Unhealthy', color: '#ff0000', emoji: '🤢' };
    if (value <= 300) return { label: 'Very Unhealthy', color: '#99004c', emoji: '😰' };
    return { label: 'Hazardous', color: '#7e0023', emoji: '💀' };
  };

  const info = getAQIInfo(aqi);

  return (
    <div className="aqi-container">
      <h4 className="aqi-title">🌬️ Air Quality Index</h4>
      <div className="aqi-display">
        <div className="aqi-value" style={{ color: info.color }}>
          {aqi}
        </div>
        <div className="aqi-info">
          <span className="aqi-emoji">{info.emoji}</span>
          <span className="aqi-label" style={{ color: info.color }}>{info.label}</span>
        </div>
        <div className="aqi-bar">
          <div className="aqi-bar-fill" style={{ width: `${Math.min(aqi / 5, 100)}%`, backgroundColor: info.color }}></div>
        </div>
      </div>
    </div>
  );
}

export default AQIDisplay;