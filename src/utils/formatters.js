export function formatTimeLabel(ts) {
  const date = new Date(ts);
  return date.toLocaleString();
}

export function formatCoords(coords) {
  if (!coords) return 'Not available';
  const lat = Number(coords.latitude).toFixed(6);
  const lng = Number(coords.longitude).toFixed(6);
  return `${lat}, ${lng}`;
}

export function digitsOnly(value) {
  return (value || '').replace(/\D/g, '');
}
