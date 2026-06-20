import React, { useState } from 'react';
import './Settings.css';

function Settings({ settings, onSave, onClose, darkMode }) {
  const [localSettings, setLocalSettings] = useState({
    unit: settings.unit || 'C',
    forecastDays: settings.forecastDays || 7,
    showHourly: settings.showHourly !== false,
    showOtherCities: settings.showOtherCities !== false,
    showWindCompass: settings.showWindCompass !== false,
    showAQI: settings.showAQI !== false,
    showMap: settings.showMap !== false,
    language: settings.language || 'en',
    showAlerts: settings.showAlerts || false,
    refreshInterval: settings.refreshInterval || 30,
    fontSize: settings.fontSize || 'medium'
  });

  const handleChange = (key, value) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(localSettings);
    
    if (localSettings.refreshInterval !== settings.refreshInterval) {
      const intervalMs = localSettings.refreshInterval * 60 * 1000;
      setTimeout(() => {
        window.location.reload();
      }, intervalMs);
    }
  };

  const languages = [
    { code: 'en', label: '🇬🇧 English' },
    { code: 'es', label: '🇪🇸 Spanish' },
    { code: 'fr', label: '🇫🇷 French' },
    { code: 'de', label: '🇩🇪 German' },
    { code: 'zh', label: '🇨🇳 Chinese' },
    { code: 'ar', label: '🇸🇦 Arabic' },
    { code: 'hi', label: '🇮🇳 Hindi' },
    { code: 'ur', label: '🇵🇰 Urdu' }
  ];

  const translations = {
    en: {
      title: '⚙️ Settings',
      temperatureUnit: '🌡️ Temperature Unit',
      celsius: '°C Celsius',
      fahrenheit: '°F Fahrenheit',
      forecastDays: '📅 Forecast Days',
      days: 'Days',
      language: '🌐 Language',
      displayOptions: '👁️ Display Options',
      hourlyForecast: 'Hourly Forecast',
      otherCities: 'Other Cities',
      windCompass: 'Wind Compass',
      airQuality: 'Air Quality Index',
      locationMap: 'Location Map',
      additionalSettings: '⚡ Additional Settings',
      weatherAlerts: '🔔 Weather Alerts',
      refreshInterval: '🔄 Refresh Interval',
      minutes: 'm',
      fontSize: '🔤 Font Size',
      small: 'Small',
      medium: 'Medium',
      large: 'Large',
      xlarge: 'X-Large',
      cancel: 'Cancel',
      save: '💾 Save Settings'
    },
    es: {
      title: '⚙️ Configuración',
      temperatureUnit: '🌡️ Unidad de Temperatura',
      celsius: '°C Celsius',
      fahrenheit: '°F Fahrenheit',
      forecastDays: '📅 Días de Pronóstico',
      days: 'Días',
      language: '🌐 Idioma',
      displayOptions: '👁️ Opciones de Visualización',
      hourlyForecast: 'Pronóstico por Hora',
      otherCities: 'Otras Ciudades',
      windCompass: 'Brújula de Viento',
      airQuality: 'Índice de Calidad del Aire',
      locationMap: 'Mapa de Ubicación',
      additionalSettings: '⚡ Configuración Adicional',
      weatherAlerts: '🔔 Alertas Meteorológicas',
      refreshInterval: '🔄 Intervalo de Actualización',
      minutes: 'm',
      fontSize: '🔤 Tamaño de Fuente',
      small: 'Pequeño',
      medium: 'Medio',
      large: 'Grande',
      xlarge: 'Extra Grande',
      cancel: 'Cancelar',
      save: '💾 Guardar Configuración'
    },
    fr: {
      title: '⚙️ Paramètres',
      temperatureUnit: '🌡️ Unité de Température',
      celsius: '°C Celsius',
      fahrenheit: '°F Fahrenheit',
      forecastDays: '📅 Jours de Prévision',
      days: 'Jours',
      language: '🌐 Langue',
      displayOptions: '👁️ Options d\'Affichage',
      hourlyForecast: 'Prévision Horaire',
      otherCities: 'Autres Villes',
      windCompass: 'Boussole de Vent',
      airQuality: 'Indice de Qualité de l\'Air',
      locationMap: 'Carte de Localisation',
      additionalSettings: '⚡ Paramètres Supplémentaires',
      weatherAlerts: '🔔 Alertes Météo',
      refreshInterval: '🔄 Intervalle de Rafraîchissement',
      minutes: 'min',
      fontSize: '🔤 Taille de Police',
      small: 'Petit',
      medium: 'Moyen',
      large: 'Grand',
      xlarge: 'Très Grand',
      cancel: 'Annuler',
      save: '💾 Enregistrer'
    },
    ur: {
      title: '⚙️ ترتیبات',
      temperatureUnit: '🌡️ درجہ حرارت کا یونٹ',
      celsius: '°C سینٹی گریڈ',
      fahrenheit: '°F فارن ہائیٹ',
      forecastDays: '📅 پیش گوئی کے دن',
      days: 'دن',
      language: '🌐 زبان',
      displayOptions: '👁️ ڈسپلے کے اختیارات',
      hourlyForecast: 'گھنٹہ وار پیش گوئی',
      otherCities: 'دیگر شہر',
      windCompass: 'ہوا کا کمپاس',
      airQuality: 'ہوا کا معیار',
      locationMap: 'مقام کا نقشہ',
      additionalSettings: '⚡ اضافی ترتیبات',
      weatherAlerts: '🔔 موسم کی اطلاعات',
      refreshInterval: '🔄 ریفریش کا وقفہ',
      minutes: 'منٹ',
      fontSize: '🔤 فونٹ کا سائز',
      small: 'چھوٹا',
      medium: 'درمیانہ',
      large: 'بڑا',
      xlarge: 'بہت بڑا',
      cancel: 'منسوخ',
      save: '💾 محفوظ کریں'
    }
  };

  const t = translations[localSettings.language] || translations.en;

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className={`settings-modal ${darkMode ? 'dark' : 'light'}`} onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>{t.title}</h2>
          <button className="settings-close" onClick={onClose}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="settings-scroll">
            <div className="settings-group">
              <label>{t.temperatureUnit}</label>
              <div className="settings-options">
                <button 
                  type="button"
                  className={`option-btn ${localSettings.unit === 'C' ? 'active' : ''}`}
                  onClick={() => handleChange('unit', 'C')}
                >
                  {t.celsius}
                </button>
                <button 
                  type="button"
                  className={`option-btn ${localSettings.unit === 'F' ? 'active' : ''}`}
                  onClick={() => handleChange('unit', 'F')}
                >
                  {t.fahrenheit}
                </button>
              </div>
            </div>

            <div className="settings-group">
              <label>{t.forecastDays}</label>
              <div className="settings-options">
                {[3, 5, 7, 10].map((days) => (
                  <button 
                    key={days}
                    type="button"
                    className={`option-btn ${localSettings.forecastDays === days ? 'active' : ''}`}
                    onClick={() => handleChange('forecastDays', days)}
                  >
                    {days} {t.days}
                  </button>
                ))}
              </div>
            </div>

            <div className="settings-group">
              <label>{t.language}</label>
              <div className="settings-options">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    className={`option-btn ${localSettings.language === lang.code ? 'active' : ''}`}
                    onClick={() => handleChange('language', lang.code)}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="settings-group">
              <label>{t.displayOptions}</label>
              <div className="settings-checkbox-grid">
                <label className="checkbox-label">
                  <input 
                    type="checkbox"
                    checked={localSettings.showHourly}
                    onChange={(e) => handleChange('showHourly', e.target.checked)}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-text">{t.hourlyForecast}</span>
                </label>
                <label className="checkbox-label">
                  <input 
                    type="checkbox"
                    checked={localSettings.showOtherCities}
                    onChange={(e) => handleChange('showOtherCities', e.target.checked)}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-text">{t.otherCities}</span>
                </label>
                <label className="checkbox-label">
                  <input 
                    type="checkbox"
                    checked={localSettings.showWindCompass}
                    onChange={(e) => handleChange('showWindCompass', e.target.checked)}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-text">{t.windCompass}</span>
                </label>
                <label className="checkbox-label">
                  <input 
                    type="checkbox"
                    checked={localSettings.showAQI}
                    onChange={(e) => handleChange('showAQI', e.target.checked)}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-text">{t.airQuality}</span>
                </label>
                <label className="checkbox-label">
                  <input 
                    type="checkbox"
                    checked={localSettings.showMap}
                    onChange={(e) => handleChange('showMap', e.target.checked)}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-text">{t.locationMap}</span>
                </label>
              </div>
            </div>

            <div className="settings-group">
              <label>{t.additionalSettings}</label>
              <div className="settings-checkbox-grid">
                <label className="checkbox-label">
                  <input 
                    type="checkbox"
                    checked={localSettings.showAlerts}
                    onChange={(e) => handleChange('showAlerts', e.target.checked)}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-text">{t.weatherAlerts}</span>
                </label>
              </div>
            </div>

            <div className="settings-group">
              <label>{t.refreshInterval}</label>
              <div className="settings-options">
                {[15, 30, 60, 120].map((minutes) => (
                  <button
                    key={minutes}
                    type="button"
                    className={`option-btn ${localSettings.refreshInterval === minutes ? 'active' : ''}`}
                    onClick={() => handleChange('refreshInterval', minutes)}
                  >
                    {minutes}{t.minutes}
                  </button>
                ))}
              </div>
            </div>

            <div className="settings-group">
              <label>{t.fontSize}</label>
              <div className="settings-options">
                {['small', 'medium', 'large', 'xlarge'].map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`option-btn ${localSettings.fontSize === size ? 'active' : ''}`}
                    onClick={() => handleChange('fontSize', size)}
                  >
                    {t[size] || size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="settings-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>{t.cancel}</button>
            <button type="submit" className="btn-save">{t.save}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Settings;