import React, { useState, useEffect, useRef } from 'react';
import './styles/App.css';
import WeatherDashboard from './components/WeatherDashboard';
import ErrorMessage from './components/ErrorMessage';
import Settings from './components/Settings';

function App() {
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('appSettings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading settings:', e);
      }
    }
    return {
      unit: 'C',
      forecastDays: 7,
      showHourly: true,
      showOtherCities: true,
      showWindCompass: true,
      showAQI: true,
      showMap: true,
      language: 'en',
      showAlerts: false,
      refreshInterval: 30,
      fontSize: 'medium'
    };
  });

  const refreshTimerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    applyFontSize(settings.fontSize);
    applyLanguage(settings.language);
  }, [settings]);

  const applyFontSize = (size) => {
    const sizes = {
      small: '14px',
      medium: '16px',
      large: '18px',
      xlarge: '20px'
    };
    document.documentElement.style.fontSize = sizes[size] || '16px';
  };

  const applyLanguage = (lang) => {
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    applyFontSize(settings.fontSize);
    applyLanguage(settings.language);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
    }

    if (settings.refreshInterval > 0) {
      const intervalMs = settings.refreshInterval * 60 * 1000;
      const timer = setInterval(() => {
        window.location.reload();
      }, intervalMs);
      refreshTimerRef.current = timer;
    }

    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, [settings.refreshInterval]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSettingsSave = (newSettings) => {
    setSettings(newSettings);
    setShowSettings(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`App ${darkMode ? 'dark' : 'light'}`}>
      <header className="app-header">
        <div className="header-top">
          <div>
            <h1>🌤️ Weather Dashboard</h1>
            <p>Real-time weather updates & 7-day forecast</p>
          </div>
        </div>
      </header>
      <main className="app-main">
        <WeatherDashboard 
          setError={setError} 
          darkMode={darkMode} 
          settings={settings}
          onToggleDarkMode={toggleDarkMode}
          onOpenSettings={() => setShowSettings(true)}
        />
        {error && <ErrorMessage message={error} />}
      </main>
      <footer className="app-footer">
        <p>© 2024 Weather Dashboard | Built with React ❤️</p>
      </footer>

      {showSettings && (
        <Settings 
          settings={settings}
          onSave={handleSettingsSave}
          onClose={() => setShowSettings(false)}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}

export default App;