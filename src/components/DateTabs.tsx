import React from "react";

interface DateTabsProps {
  forecast: {
    dayLabel: string;
    maxTemp: number;
    minTemp: number;
  }[];
  selectedDayIndex: number;
  onSelectDay: (index: number) => void;
}

const DateTabs: React.FC<DateTabsProps> = ({
  forecast,
  selectedDayIndex,
  onSelectDay,
}) => {
  return (
    <div className="overflow-x-auto w-full scrollbar-hide">
  <div className="flex space-x-2 mb-4 pl-2 sm:pl-0 justify-start lg:justify-center">
    {forecast.map((day, index) => (
      <button
        key={index}
        className={`px-4 py-2 rounded text-center flex-shrink-0 ${
          index === selectedDayIndex
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
        onClick={() => onSelectDay(index)}
      >
        <div>{day.dayLabel}</div>
        <div className="text-sm text-gray-500">
          {day.maxTemp.toFixed(1)}°C / {day.minTemp.toFixed(1)}°C
        </div>
      </button>
    ))}
  </div>
</div>
  );
};

export default DateTabs;