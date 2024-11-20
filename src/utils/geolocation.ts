import { Geolocation } from '@capacitor/geolocation';

export const getCurrentPosition = async (): Promise<{ latitude: number; longitude: number }> => {
  try {
    const position = await Geolocation.getCurrentPosition();
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
  } catch (error) {
    console.error('Error getting location:', error);
    throw new Error('Unable to retrieve location. Please enable location services.');
  }
};