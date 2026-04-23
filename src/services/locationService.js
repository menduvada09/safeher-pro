import { Platform } from 'react-native';
import * as Location from 'expo-location';

export async function requestLocationPermission() {
  if (Platform.OS === 'web') {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      throw new Error('Browser geolocation is not supported');
    }
    return true;
  }
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') throw new Error('Location permission denied');
  return true;
}

export async function getCurrentLocation() {
  await requestLocationPermission();

  if (Platform.OS === 'web') {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          speed: position.coords.speed || 0,
          accuracy: position.coords.accuracy || 0
        }),
        (error) => reject(new Error(error?.message || 'Could not fetch location')),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    });
  }

  const current = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.BestForNavigation,
    maximumAge: 0,
    mayShowUserSettingsDialog: true
  });
  return current.coords;
}

export async function startLocationWatch(onUpdate, onError) {
  await requestLocationPermission();

  if (Platform.OS === 'web') {
    const watchId = navigator.geolocation.watchPosition(
      (position) => onUpdate({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        speed: position.coords.speed || 0,
        accuracy: position.coords.accuracy || 0
      }),
      (error) => onError?.(new Error(error?.message || 'Live tracking failed')),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
    return { remove: () => navigator.geolocation.clearWatch(watchId) };
  }

  return Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.BestForNavigation,
      timeInterval: 4000,
      distanceInterval: 1,
      mayShowUserSettingsDialog: true
    },
    (location) => onUpdate(location.coords)
  );
}
