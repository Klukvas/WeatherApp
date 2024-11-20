export const getCityByCoordinates = async (
    latitude: number,
    longitude: number,
    apiKey: string
  ): Promise<string | null> => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`
      );
      const data = await response.json();
      if (data.length > 0) {
        return data[0].name; // Возвращаем название города
      }
      return null;
    } catch (error) {
      console.error("Error fetching city by coordinates:", error);
      return null;
    }
  };
  
  export const getCoordinates = (): Promise<{
    latitude: number;
    longitude: number;
  }> => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve({ latitude, longitude });
          },
          (error) => {
            reject(error.message);
          }
        );
      } else {
        reject("Geolocation is not supported by this browser.");
      }
    });
  };