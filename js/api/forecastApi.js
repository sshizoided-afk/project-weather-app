const API_KEY = 'ed78a9d375a0224f48d57f2455711a31';
const BASE = 'https://api.openweathermap.org/data/2.5';

export async function fetchForecastByCity(city, units = 'metric', lang = 'ru') {
  const url = `${BASE}/forecast?q=${encodeURIComponent(city)}&units=${units}&lang=${lang}&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    const err = new Error('Ошибка запроса прогноза');
    err.status = res.status;
    throw err;
  }
  return res.json();
}
