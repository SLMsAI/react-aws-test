import { useEffect, useMemo, useState } from 'react';

const cities = [
  { id: 'nyc', name: 'New York, US', lat: 40.7128, lon: -74.006 },
  { id: 'lon', name: 'London, UK', lat: 51.5072, lon: -0.1276 },
  { id: 'blr', name: 'Bengaluru, IN', lat: 12.9716, lon: 77.5946 },
  { id: 'tok', name: 'Tokyo, JP', lat: 35.6762, lon: 139.6503 },
  { id: 'sfo', name: 'San Francisco, US', lat: 37.7749, lon: -122.4194 }
];

const weatherDescriptions = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Heavy drizzle',
  56: 'Freezing drizzle',
  57: 'Freezing drizzle',
  61: 'Light rain',
  63: 'Rain',
  65: 'Heavy rain',
  66: 'Freezing rain',
  67: 'Freezing rain',
  71: 'Light snow',
  73: 'Snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Rain showers',
  81: 'Rain showers',
  82: 'Heavy showers',
  85: 'Snow showers',
  86: 'Snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
  99: 'Thunderstorm with hail'
};

const weatherIcons = {
  0: '☀️',
  1: '🌤️',
  2: '⛅️',
  3: '☁️',
  45: '🌫️',
  48: '🌫️',
  51: '🌦️',
  53: '🌦️',
  55: '🌧️',
  56: '🌧️',
  57: '🌧️',
  61: '🌧️',
  63: '🌧️',
  65: '🌧️',
  66: '🌧️',
  67: '🌧️',
  71: '🌨️',
  73: '🌨️',
  75: '🌨️',
  77: '🌨️',
  80: '🌧️',
  81: '🌧️',
  82: '🌧️',
  85: '🌨️',
  86: '🌨️',
  95: '⛈️',
  96: '⛈️',
  99: '⛈️'
};

function App() {
  const [cityId, setCityId] = useState(cities[0].id);
  const [weather, setWeather] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [requestId, setRequestId] = useState(0);

  const city = useMemo(() => cities.find((c) => c.id === cityId) ?? cities[0], [cityId]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setStatus('loading');
      setError('');

      try {
        const apiBase = import.meta.env.VITE_WEATHER_API_BASE || 'https://api.open-meteo.com';
        const url = `${apiBase.replace(/\/$/, '')}/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`;
        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }

        const data = await res.json();
        if (cancelled) return;

        const current = data.current;
        const units = data.current_units;

        setWeather({
          temperature: current.temperature_2m,
          apparentTemperature: current.apparent_temperature,
          humidity: current.relative_humidity_2m,
          wind: current.wind_speed_10m,
          code: current.weather_code,
          time: current.time,
          units: {
            temperature: units.temperature_2m,
            humidity: units.relative_humidity_2m,
            wind: units.wind_speed_10m
          }
        });
        setStatus('success');
      } catch (err) {
        if (cancelled) return;
        setError(err?.message || 'Unable to fetch weather right now.');
        setStatus('error');
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [city, requestId]);

  const summary = weatherDescriptions[weather?.code] || 'Fetching conditions';
  const icon = weatherIcons[weather?.code] || '🌍';
  const lastUpdated = weather?.time
    ? new Date(weather.time).toLocaleString(undefined, { weekday: 'short', hour: 'numeric', minute: '2-digit' })
    : null;

  const stats = weather
    ? [
        { label: 'Temperature', value: `${weather.temperature}°${weather.units.temperature}` },
        { label: 'Feels like', value: `${weather.apparentTemperature}°${weather.units.temperature}` },
        { label: 'Humidity', value: `${weather.humidity}${weather.units.humidity}` },
        { label: 'Wind', value: `${weather.wind} ${weather.units.wind}` }
      ]
    : [];

  return (
    <div className="page">
      <header className="hero">
        <p className="eyebrow">Weather · Open-Meteo</p>
        <h1>Check the weather for a city</h1>
        <p className="lede">
          Uses the free Open-Meteo API (no key required). Pick a city to see current conditions with temperature,
          humidity, and wind.
        </p>

        <div className="controls">
          <label className="label" htmlFor="city">
            City
          </label>
          <select id="city" className="select" value={cityId} onChange={(e) => setCityId(e.target.value)}>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button className="button ghost" type="button" onClick={() => setRequestId((n) => n + 1)}>
            Refresh
          </button>
        </div>

        {lastUpdated ? <p className="muted small">Last updated: {lastUpdated}</p> : null}
      </header>

      <main className="content">
        <section className="panel weather-panel">
          {status === 'loading' && <p className="muted">Fetching weather for {city.name}…</p>}
          {status === 'error' && (
            <div className="error">
              <p>Could not load weather data.</p>
              <p className="muted small">{error}</p>
            </div>
          )}

          {status === 'success' && weather ? (
            <>
              <div className="current">
                <div className="icon">{icon}</div>
                <div>
                  <p className="eyebrow">{city.name}</p>
                  <h2>
                    {weather.temperature}°{weather.units.temperature}
                  </h2>
                  <p className="muted">{summary}</p>
                </div>
              </div>

              <div className="stat-grid">
                {stats.map((stat) => (
                  <div key={stat.label} className="stat">
                    <p className="muted small">{stat.label}</p>
                    <p className="stat-value">{stat.value}</p>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </section>
      </main>
    </div>
  );
}

export default App;
