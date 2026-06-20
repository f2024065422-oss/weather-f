import React from 'react';
import './BottomNav.css';

function BottomNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'today', icon: '📊', label: 'Today' },
    { id: 'hourly', icon: '⏰', label: 'Hourly' },
    { id: 'forecast', icon: '📅', label: 'Forecast' },
    { id: 'favorites', icon: '⭐', label: 'Favorites' },
    { id: 'map', icon: '🗺️', label: 'Map' },
    { id: 'compare', icon: '📊', label: 'Compare' }
  ];

  return (
    <div className="bottom-nav">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`bottom-nav-item ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="bottom-nav-icon">{tab.icon}</span>
          <span className="bottom-nav-label">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

export default BottomNav;