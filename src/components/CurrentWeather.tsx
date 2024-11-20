import React, { useState, useEffect } from "react";
import { apiKey } from "../apiKey";

interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  icon: string;
}

const CurrentWeather: React.FC<{ city: string }> = ({ city }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch weather data");
        }
        const data = await response.json();
        setWeather({
          city: data.name,
          temperature: data.main.temp,
          description: data.weather[0].description,
          icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        });
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  if (!weather) {
    return null;
  }

  return (
    <div className="bg-white shadow-md rounded p-4 text-center mb-6">
      <h2 className="text-xl font-bold">{weather.city}</h2>
      <img
        src={weather.icon}
        alt={weather.description}
        className="mx-auto"
      />
      <p className="text-lg">{weather.temperature}°C</p>
      <p className="text-gray-500 capitalize">{weather.description}</p>
    </div>
  );
};

export default CurrentWeather;