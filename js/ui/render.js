import { els } from './dom.js';
import { formatTemperature, formatWind } from '../helpers/format.js';

export function showError(message) {
  els.error.textContent = message;
  els.error.classList.remove('hidden');
  els.card.classList.add('hidden');
  els.forecastSection.classList.add('hidden');
}

export function clearError() {
  els.error.textContent = '';
  els.error.classList.add('hidden');
}

export function renderWeather(data) {
  clearError();
  const name = `${data.name}, ${data.sys?.country || ''}`.trim();
  els.cityName.textContent = name;

  const iconCode = data.weather?.[0]?.icon;
  els.icon.innerHTML = iconCode ? `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${data.weather[0].description}" />` : '';

  els.temp.textContent = formatTemperature(data.main.temp);
  els.descr.textContent = data.weather?.[0]?.description || '';

  els.details.innerHTML = `
    <li><strong>Ощущается:</strong> ${formatTemperature(data.main.feels_like)}</li>
    <li><strong>Влажность:</strong> ${data.main.humidity}%</li>
    <li><strong>Ветер:</strong> ${formatWind(data.wind)}</li>
  `;

  els.card.classList.remove('hidden');
}

export function renderForecast(forecastData, onDaySelect) {
  const groups = {};
  forecastData.list.forEach(item => {
    const d = new Date(item.dt * 1000);
    const dateKey = d.toISOString().slice(0,10);
    groups[dateKey] = groups[dateKey] || [];
    groups[dateKey].push(item);
  });

  const days = Object.keys(groups).slice(0,5);
  els.daysList.innerHTML = '';
  els.dayForecast.innerHTML = '';
  if (days.length === 0) {
    els.forecastSection.classList.add('hidden');
    return;
  }
  els.forecastSection.classList.remove('hidden');

  days.forEach((date, idx) => {
    const pill = document.createElement('button');
    pill.type = 'button';
    pill.className = 'day-pill' + (idx===0 ? ' active' : '');
    pill.dataset.date = date;
    const dt = new Date(date);
    pill.textContent = dt.toLocaleDateString('ru-RU', {weekday:'short', day:'numeric', month:'short'});
    pill.addEventListener('click', () => {
      els.daysList.querySelectorAll('.day-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      renderForecastDay(groups[date]);
      if (typeof onDaySelect === 'function') onDaySelect(date, groups[date]);
    });
    els.daysList.appendChild(pill);
    if (idx===0) renderForecastDay(groups[date]);
  });
}

function renderForecastDay(listItems) {
  els.dayForecast.innerHTML = listItems.map(item => {
    const d = new Date(item.dt * 1000);
    const time = d.toLocaleTimeString('ru-RU', {hour:'2-digit',minute:'2-digit'});
    const icon = item.weather?.[0]?.icon ? `<img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="" />` : '';
    const temp = formatTemperature(item.main.temp);
    const desc = item.weather?.[0]?.description || '';
    return `<div class="forecast-item">
      <div class="f-time">${time}</div>
      <div class="f-icon">${icon}</div>
      <div class="f-temp">${temp}</div>
      <div class="f-desc">${desc}</div>
    </div>`;
  }).join('');
}
