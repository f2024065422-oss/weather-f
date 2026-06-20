import React from 'react';
import './WeatherMap.css';

function WeatherMap({ city, lat, lon }) {
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.1}%2C${lat-0.1}%2C${lon+0.1}%2C${lat+0.1}&layer=mapnik&marker=${lat}%2C${lon}`;

  return (
    <div className="weather-map-container">
      <h4 className="map-title">🗺️ Location Map</h4>
      <div className="map-wrapper">
        <iframe
          title="Weather Map"
          src={mapUrl}
          className="map-iframe"
          allowFullScreen
        />
      </div>
      {city && (
        <div className="map-location">
          <span className="map-pin">📍</span>
          <span className="map-city">{city}</span>
        </div>
      )}
    </div>
  );
}

export default WeatherMap;