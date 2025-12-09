require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const PORT = process.env.PORT || 4000;
const WEATHER_API_BASE = process.env.WEATHER_API_BASE || 'https://api.open-meteo.com';

const app = express();
app.use(cors());

app.get('/weather', async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'lat and lon are required query params' });
  }

  const url = `${WEATHER_API_BASE.replace(/\/$/, '')}/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`;

  try {
    const upstream = await fetch(url);
    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: `Upstream error: ${upstream.status}` });
    }

    const data = await upstream.json();
    const current = data.current;
    const units = data.current_units;

    return res.json({
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
  } catch (err) {
    console.error('Error fetching weather:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Weather API listening on port ${PORT}`);
});
