import React from 'react';
import './WindCompass.css';

function WindCompass({ windSpeed, windDeg }) {
  const getWindDirection = (deg) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round((deg % 360) / 45) % 8;
    return directions[index];
  };

  const getFullDirection = (deg) => {
    const directions = [
      { from: 348.75, to: 360, name: 'North' },
      { from: 0, to: 11.25, name: 'North' },
      { from: 11.25, to: 33.75, name: 'North-Northeast' },
      { from: 33.75, to: 56.25, name: 'Northeast' },
      { from: 56.25, to: 78.75, name: 'East-Northeast' },
      { from: 78.75, to: 101.25, name: 'East' },
      { from: 101.25, to: 123.75, name: 'East-Southeast' },
      { from: 123.75, to: 146.25, name: 'Southeast' },
      { from: 146.25, to: 168.75, name: 'South-Southeast' },
      { from: 168.75, to: 191.25, name: 'South' },
      { from: 191.25, to: 213.75, name: 'South-Southwest' },
      { from: 213.75, to: 236.25, name: 'Southwest' },
      { from: 236.25, to: 258.75, name: 'West-Southwest' },
      { from: 258.75, to: 281.25, name: 'West' },
      { from: 281.25, to: 303.75, name: 'West-Northwest' },
      { from: 303.75, to: 326.25, name: 'Northwest' },
      { from: 326.25, to: 348.75, name: 'North-Northwest' }
    ];

    const normalizedDeg = deg % 360;
    for (let dir of directions) {
      if (normalizedDeg >= dir.from && normalizedDeg < dir.to) {
        return dir.name;
      }
    }
    return 'North';
  };

  const deg = windDeg || 0;
  const direction = getWindDirection(deg);
  const fullDirection = getFullDirection(deg);

  return (
    <div className="wind-compass-container">
      <div className="wind-compass-title">💨 Wind Direction</div>
      <div className="wind-compass-circle">
        <div className="wind-compass-arrow" style={{ transform: `rotate(${deg}deg)` }}>
          <div className="wind-arrow-tip"></div>
          <div className="wind-arrow-line"></div>
        </div>
        <div className="wind-compass-labels">
          <span className="wind-label-n">N</span>
          <span className="wind-label-e">E</span>
          <span className="wind-label-s">S</span>
          <span className="wind-label-w">W</span>
        </div>
        <div className="wind-compass-center">
          <span className="wind-speed-value">{Math.round(windSpeed || 0)}</span>
          <span className="wind-speed-unit">km/h</span>
        </div>
      </div>
      <div className="wind-compass-info">
        <span className="wind-direction-short">{direction}</span>
        <span className="wind-direction-full">{fullDirection}</span>
      </div>
    </div>
  );
}

export default WindCompass;