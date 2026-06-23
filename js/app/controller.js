import { fetchWeatherByCity } from '../api/weatherApi.js';
import { fetchForecastByCity } from '../api/forecastApi.js';
import { renderWeather, renderForecast, showError } from '../ui/render.js';
import { els } from '../ui/dom.js';
import { state } from './state.js';

let lastForecast = null;

export async function loadAndRender(city = state.defaultCity) {
  try {
    els.input.value = city;
    const [weatherData, forecastData] = await Promise.all([
      fetchWeatherByCity(city),
      fetchForecastByCity(city),
    ]);
    renderWeather(weatherData);
    lastForecast = forecastData;
    renderForecast(forecastData);
  } catch (err) {
    if (err && err.status === 404) showError('Город не найден');
    else showError('Не удалось получить данные погоды');
    console.error(err);
  }
}

export function attachHandlers() {
  els.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const q = els.input.value.trim();
    if (!q) return;
    await loadAndRender(q);
  });
}

export function selectForecastDay(dateString) {
  if (!lastForecast) return;
  const groups = {};
  lastForecast.list.forEach(item => {
    const d = new Date(item.dt * 1000);
    const dateKey = d.toISOString().slice(0,10);
    groups[dateKey] = groups[dateKey] || [];
    groups[dateKey].push(item);
  });
  if (!groups[dateString]) return;
  const pill = Array.from(els.daysList.children).find(ch => ch.dataset && ch.dataset.date === dateString);
  if (pill) pill.click();
}
