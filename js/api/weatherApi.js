const API_KEY = '0104550a31ee1b84bdbeca71a8a9ca71';
const BASE = 'https://api.openweathermap.org/data/2.5';

export async function fetchWeatherByCity(city, units = 'metric', lang = 'ru') {
  const url = `${BASE}/weather?q=${encodeURIComponent(city)}&units=${units}&lang=${lang}&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    const err = new Error('Ошибка запроса погоды');
    err.status = res.status;
    throw err;
  }
  return res.json();
}
