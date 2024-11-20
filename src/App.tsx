import React, { useState } from "react";
import CurrentWeather from "./components/CurrentWeather";
import WeatherForecast from "./components/WeatherForecast";
import CitySearch from "./components/CitySearch";
import { useLocation } from "./hooks/useLocation";

function App() {
  const { city: autoDetectedCity, loading, error } = useLocation();
  const [city, setCity] = useState<string>("");

  const handleCitySearch = (searchedCity: string) => {
    setCity(searchedCity); // Устанавливаем новый город для отображения
  };

  const currentCity = city || autoDetectedCity; // Приоритет ручному вводу

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-blue-800 mb-6">Weather App</h1>
      {loading && !currentCity ? (
        <p className="text-gray-500">Detecting your location...</p>
      ) : error && !currentCity ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <CitySearch onSearch={handleCitySearch} />
          {currentCity && (
            <>
              <CurrentWeather city={currentCity} />
              <WeatherForecast city={currentCity} />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;