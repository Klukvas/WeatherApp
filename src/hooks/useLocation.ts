import { useState, useEffect } from "react";
import { getCityByCoordinates, getCoordinates } from "../services/locationService";
import { apiKey } from "../apiKey";

export const useLocation = () => {
  const [city, setCity] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocationAndCity = async () => {
      setLoading(true);
      setError(null);
      try {
        const { latitude, longitude } = await getCoordinates();
        const cityName = await getCityByCoordinates(latitude, longitude, apiKey);
        if (cityName) {
          setCity(cityName);
        } else {
          setError("City not found");
        }
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocationAndCity();
  }, []);

  return { city, loading, error };
};