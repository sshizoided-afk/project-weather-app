export function formatTemperature(t) {
  if (t === undefined || t === null) return '-';
  return `${Math.round(t)}°C`;
}

export function formatWind(w) {
  if (!w) return '-';
  const speed = w.speed ? `${Math.round(w.speed)} м/с` : '-';
  const dir = w.deg !== undefined ? degToCompass(w.deg) : '';
  return `${speed}${dir ? ', ' + dir : ''}`;
}

function degToCompass(num) {
  const val = Math.floor((num / 22.5) + 0.5);
  const arr = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  return arr[(val % 16)];
}
