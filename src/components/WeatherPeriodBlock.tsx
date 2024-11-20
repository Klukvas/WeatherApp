import React from "react";

interface WeatherPeriodBlockProps {
  period: string;
  temperature: number;
  description: string;
  icon: string;
  time: string;
}

const WeatherPeriodBlock: React.FC<WeatherPeriodBlockProps> = ({
  period,
  temperature,
  description,
  icon,
  time,
}) => {
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm text-center max-w-full box-border">
      <h4 className="capitalize font-bold text-blue-600">{period}</h4>
      <img src={icon} alt={description} className="mx-auto mb-2" />
      <p className="text-lg font-semibold text-gray-800">
        {temperature.toFixed(1)}°C
      </p>
      <p className="text-sm text-gray-500 capitalize">{description}</p>
      <p className="text-xs text-gray-400">{time}</p>
    </div>
  );
};

export default WeatherPeriodBlock;