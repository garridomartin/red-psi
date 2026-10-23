import { UserLocation } from '@/types';

/**
 * Calculates the great-circle distance between two points on the Earth (Haversine formula) in kilometers.
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return Math.round(d * 10) / 10;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Formats a distance in km to user-friendly Spanish text.
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `a ${meters} m de vos`;
  }
  return `a ${distanceKm.toFixed(1)} km de vos`;
}

/**
 * Request user's current GPS position via browser Geolocation API
 */
export function requestBrowserLocation(): Promise<UserLocation> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      reject(new Error('La geolocalización no es soportada por tu navegador.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        let msg = 'No pudimos obtener tu ubicación.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Permiso de ubicación denegado.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'La señal de ubicación no está disponible.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Tiempo de espera de geolocalización agotado.';
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
}
