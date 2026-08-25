const EARTH_RADIUS_METERS = 6371000;

function toRadians(degree) {
  return degree * (Math.PI / 180);
}

export function calculateDistance(
  latitude1,
  longitude1,
  latitude2,
  longitude2,
) {
  const lat1 = toRadians(latitude1);

  const lat2 = toRadians(latitude2);

  const deltaLat = toRadians(latitude2 - latitude1);

  const deltaLng = toRadians(longitude2 - longitude1);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_METERS * c;
}

export function formatDistance(meters) {
  if (meters === null || meters === undefined) {
    return null;
  }

  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }

  return `${(meters / 1000).toFixed(1)}km`;
}
