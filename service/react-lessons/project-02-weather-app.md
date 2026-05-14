# 🎯 Project ០២ - Weather App

## 🎯 គោលដៅគម្រោង
សាងសង់ Weather App ដែលអាច៖
- ស្វែងរកអាកាសធាតុតាមទីក្រុង
- បង្ហាញ temperature, humidity, wind
- បង្ហាញ icon អាកាសធាតុ
- រក្សា search history

---

## 📦 Setup

```bash
npm create vite@latest weather-app -- --template react
cd weather-app
npm install
npm run dev
```

---

## 🔑 API Key

ប្រើ **OpenWeatherMap API**៖
1. ចូល [openweathermap.org](https://openweathermap.org/api)
2. ចុះឈ្មោះ (free)
3. យក API key

បង្កើតឯកសារ `.env`៖
```
VITE_WEATHER_API_KEY=your_api_key_here
```

---

## 📁 Project Structure

```
weather-app/
├── src/
│   ├── components/
│   │   ├── SearchBar.jsx
│   │   ├── WeatherCard.jsx
│   │   ├── ForecastList.jsx
│   │   └── HistoryList.jsx
│   ├── hooks/
│   │   └── useWeather.js
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── .env
└── package.json
```

---

## 1. Custom Hook: useWeather

```jsx
// src/hooks/useWeather.js
import { useState } from 'react';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export function useWeather() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  async function fetchWeather(city) {
    if (!city.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Current weather
      const weatherRes = await fetch(
        `${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      
      if (!weatherRes.ok) {
        throw new Error(weatherRes.status === 404 
          ? `មិនមានទីក្រុង "${city}"` 
          : 'មានបញ្ហា');
      }
      
      const weatherData = await weatherRes.json();
      setWeather(weatherData);
      
      // 5-day forecast
      const forecastRes = await fetch(
        `${BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`
      );
      const forecastData = await forecastRes.json();
      setForecast(forecastData);
      
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  }
  
  return { weather, forecast, loading, error, fetchWeather };
}
```

---

## 2. Component: SearchBar

```jsx
// src/components/SearchBar.jsx
import { useState } from 'react';

function SearchBar({ onSearch }) {
  const [city, setCity] = useState("");
  
  function handleSubmit(e) {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
      setCity("");
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input 
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="ឈ្មោះទីក្រុង (ឧ. Phnom Penh)"
      />
      <button type="submit">🔍 ស្វែងរក</button>
    </form>
  );
}

export default SearchBar;
```

---

## 3. Component: WeatherCard

```jsx
// src/components/WeatherCard.jsx
function WeatherCard({ weather }) {
  if (!weather) return null;
  
  const {
    name,
    sys: { country },
    main: { temp, feels_like, humidity, pressure },
    weather: [{ main, description, icon }],
    wind: { speed },
    visibility
  } = weather;
  
  return (
    <div className="weather-card">
      <div className="weather-header">
        <h2>📍 {name}, {country}</h2>
        <p className="description">{description}</p>
      </div>
      
      <div className="weather-main">
        <img 
          src={`https://openweathermap.org/img/wn/${icon}@4x.png`}
          alt={main}
        />
        <div className="temp">
          <span className="temp-value">{Math.round(temp)}°</span>
          <span className="temp-unit">C</span>
        </div>
      </div>
      
      <div className="weather-details">
        <div className="detail">
          <span>🌡️ Feels Like</span>
          <strong>{Math.round(feels_like)}°C</strong>
        </div>
        <div className="detail">
          <span>💧 Humidity</span>
          <strong>{humidity}%</strong>
        </div>
        <div className="detail">
          <span>💨 Wind</span>
          <strong>{speed} m/s</strong>
        </div>
        <div className="detail">
          <span>🔵 Pressure</span>
          <strong>{pressure} hPa</strong>
        </div>
        <div className="detail">
          <span>👁️ Visibility</span>
          <strong>{(visibility / 1000).toFixed(1)} km</strong>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;
```

---

## 4. Component: ForecastList

```jsx
// src/components/ForecastList.jsx
function ForecastList({ forecast }) {
  if (!forecast) return null;
  
  // យក 1 forecast ក្នុង 1 ថ្ងៃ (12:00 PM)
  const daily = forecast.list.filter(item => 
    item.dt_txt.includes('12:00:00')
  );
  
  return (
    <div className="forecast">
      <h3>📅 5-Day Forecast</h3>
      <div className="forecast-list">
        {daily.map(day => {
          const date = new Date(day.dt * 1000);
          const weekday = date.toLocaleDateString('km-KH', { weekday: 'short' });
          
          return (
            <div key={day.dt} className="forecast-item">
              <p className="day">{weekday}</p>
              <img 
                src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                alt={day.weather[0].main}
              />
              <p className="temp">{Math.round(day.main.temp)}°C</p>
              <p className="desc">{day.weather[0].main}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ForecastList;
```

---

## 5. Component: HistoryList

```jsx
// src/components/HistoryList.jsx
function HistoryList({ history, onSelect, onClear }) {
  if (history.length === 0) return null;
  
  return (
    <div className="history">
      <div className="history-header">
        <h4>🕐 ប្រវត្តិស្វែងរក</h4>
        <button onClick={onClear}>លុបទាំងអស់</button>
      </div>
      <div className="history-list">
        {history.map((city, i) => (
          <button 
            key={i}
            onClick={() => onSelect(city)}
            className="history-item"
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
}

export default HistoryList;
```

---

## 6. Main App

```jsx
// src/App.jsx
import { useState, useEffect } from 'react';
import { useWeather } from './hooks/useWeather';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import ForecastList from './components/ForecastList';
import HistoryList from './components/HistoryList';
import './App.css';

function App() {
  const { weather, forecast, loading, error, fetchWeather } = useWeather();
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('weatherHistory');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Load default city
  useEffect(() => {
    fetchWeather('Phnom Penh');
  }, []);
  
  // Save history
  useEffect(() => {
    localStorage.setItem('weatherHistory', JSON.stringify(history));
  }, [history]);
  
  function handleSearch(city) {
    fetchWeather(city);
    
    // Add to history (no duplicates)
    setHistory(prev => {
      const filtered = prev.filter(c => c.toLowerCase() !== city.toLowerCase());
      return [city, ...filtered].slice(0, 5);  // Keep 5
    });
  }
  
  function handleClearHistory() {
    setHistory([]);
  }
  
  return (
    <div className="app">
      <header>
        <h1>🌤️ Weather App</h1>
        <p>ព័ត៌មានអាកាសធាតុពេលបច្ចុប្បន្ន</p>
      </header>
      
      <main>
        <SearchBar onSearch={handleSearch} />
        
        <HistoryList 
          history={history}
          onSelect={handleSearch}
          onClear={handleClearHistory}
        />
        
        {loading && <p className="loading">⏳ កំពុងផ្ទុក...</p>}
        
        {error && <p className="error">❌ {error}</p>}
        
        {weather && !loading && (
          <>
            <WeatherCard weather={weather} />
            <ForecastList forecast={forecast} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
```

---

## 7. Styles

```css
/* src/App.css */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Khmer OS', Arial, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  color: #333;
}

.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px 20px;
}

header {
  text-align: center;
  margin-bottom: 30px;
  color: white;
}

header h1 {
  font-size: 42px;
  margin-bottom: 10px;
}

.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-bar input {
  flex: 1;
  padding: 14px 20px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.search-bar input:focus {
  outline: none;
}

.search-bar button {
  padding: 14px 24px;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.history {
  background: rgba(255, 255, 255, 0.2);
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 20px;
  color: white;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.history-header button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 14px;
  text-decoration: underline;
}

.history-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.history-item {
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.3);
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
}

.history-item:hover {
  background: rgba(255, 255, 255, 0.5);
}

.weather-card {
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
  margin-bottom: 20px;
}

.weather-header h2 {
  font-size: 28px;
  margin-bottom: 5px;
}

.description {
  color: #666;
  text-transform: capitalize;
}

.weather-main {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
}

.weather-main img {
  width: 150px;
}

.temp {
  display: flex;
  align-items: flex-start;
}

.temp-value {
  font-size: 80px;
  font-weight: bold;
  color: #333;
}

.temp-unit {
  font-size: 30px;
  margin-top: 10px;
  color: #666;
}

.weather-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.detail {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 10px;
}

.detail span {
  font-size: 13px;
  color: #888;
}

.detail strong {
  font-size: 18px;
  color: #333;
}

.forecast {
  background: white;
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.forecast h3 {
  margin-bottom: 15px;
}

.forecast-list {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}

.forecast-item {
  text-align: center;
  padding: 15px 10px;
  background: #f9f9f9;
  border-radius: 12px;
}

.forecast-item .day {
  font-weight: bold;
  margin-bottom: 5px;
}

.forecast-item img {
  width: 50px;
}

.forecast-item .temp {
  font-size: 18px;
  font-weight: bold;
}

.forecast-item .desc {
  font-size: 12px;
  color: #888;
}

.loading, .error {
  text-align: center;
  padding: 30px;
  background: white;
  border-radius: 12px;
  font-size: 18px;
}

.error {
  color: #e74c3c;
}

@media (max-width: 600px) {
  .forecast-list {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

---

## ✅ លក្ខណៈពិសេស

✨ ស្វែងរកអាកាសធាតុតាមឈ្មោះទីក្រុង  
✨ Current weather (temp, humidity, wind, etc.)  
✨ 5-day forecast  
✨ Search history (5 ចុងក្រោយ)  
✨ Auto-load Phnom Penh ដំបូង  
✨ Responsive design  
✨ Beautiful UI  

---

## 🚀 ពង្រីកគម្រោងបន្ថែម

1. បន្ថែម geolocation (current location)
2. បន្ថែម unit toggle (Celsius/Fahrenheit)
3. បន្ថែម hourly forecast
4. បន្ថែម map ពី leaflet/mapbox
5. បន្ថែម weather alerts
6. បន្ថែម multiple cities dashboard
7. បន្ថែម background ផ្លាស់ប្តូរតាមអាកាសធាតុ
8. បន្ថែម dark mode

➡️ **បន្ទាប់៖** [Project ០៣ - E-commerce App](./project-03-ecommerce-app.md)
