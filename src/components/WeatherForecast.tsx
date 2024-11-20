import React, { useState, useEffect } from "react";
import WeatherPeriodBlock from "./WeatherPeriodBlock";
import DateTabs from "./DateTabs";
import { apiKey } from "../apiKey";
import { Geolocation } from "@capacitor/geolocation";

interface PeriodForecast {
  time: string;
  temperature: number;
  description: string;
  icon: string;
}

interface DayForecast {
  date: string;
  dayLabel: string;
  periods: {
    night: PeriodForecast | null;
    morning: PeriodForecast | null;
    afternoon: PeriodForecast | null;
    evening: PeriodForecast | null;
  };
  maxTemp: number;
  minTemp: number;
}

const WeatherForecast: React.FC<{ city?: string }> = ({ city }) => {
  const [forecast, setForecast] = useState<DayForecast[]>([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCity, setCurrentCity] = useState<string | null>(city || null); // Название города

  useEffect(() => {
    const fetchForecast = async (cityName: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${apiKey}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch forecast data");
        }
        const data = await response.json();

        const groupedForecast = groupForecastByDay(data.list);
        setForecast(groupedForecast);
        setCurrentCity(data.city.name); // Устанавливаем название города
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchForecastByCoords = async (lat: number, lon: number) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch forecast data");
        }
        const data = await response.json();

        const groupedForecast = groupForecastByDay(data.list);
        setForecast(groupedForecast);
        setCurrentCity(data.city.name); // Устанавливаем название города
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const requestLocationAndFetchWeather = async () => {
      if (!city) {
        try {
          const position = await Geolocation.getCurrentPosition();
          const { latitude, longitude } = position.coords;
          fetchForecastByCoords(latitude, longitude);
        } catch (error) {
          setError("Unable to retrieve location. Please enable location services.");
        }
      } else {
        fetchForecast(city);
      }
    };

    requestLocationAndFetchWeather();
  }, [city]);

  const groupForecastByDay = (list: any[]): DayForecast[] => {
    const result: DayForecast[] = [];
    const dateFormatter = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      day: "numeric",
    });

    list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const hour = date.getHours();
      const day = date.toISOString().split("T")[0];

      const periodKey =
        hour < 6
          ? "night"
          : hour < 12
          ? "morning"
          : hour < 18
          ? "afternoon"
          : "evening";

      let dayEntry = result.find((entry) => entry.date === day);
      if (!dayEntry) {
        dayEntry = {
          date: day,
          dayLabel: dateFormatter.format(date),
          periods: { night: null, morning: null, afternoon: null, evening: null },
          maxTemp: -Infinity,
          minTemp: Infinity,
        };
        result.push(dayEntry);
      }

      const temperature = item.main.temp;
      dayEntry.maxTemp = Math.max(dayEntry.maxTemp, temperature);
      dayEntry.minTemp = Math.min(dayEntry.minTemp, temperature);

      dayEntry.periods[periodKey] = {
        time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        temperature,
        description: item.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
      };
    });

    return result;
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading forecast...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="w-full px-4">
      <h1 className="text-center text-2xl font-bold mb-4">
        Weather in {currentCity || "your location"}
      </h1>
      <DateTabs
        forecast={forecast.map((day) => ({
          dayLabel: day.dayLabel,
          maxTemp: day.maxTemp,
          minTemp: day.minTemp,
        }))}
        selectedDayIndex={selectedDayIndex}
        onSelectDay={setSelectedDayIndex}
      />

      <div className="w-full flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full sm:w-2/3 lg:w-1/2 max-w-2xl">
          {Object.entries(forecast[selectedDayIndex].periods).map(([period, data]) =>
            data ? (
              <WeatherPeriodBlock
                key={period}
                period={period}
                temperature={data.temperature}
                description={data.description}
                icon={data.icon}
                time={data.time}
              />
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherForecast;