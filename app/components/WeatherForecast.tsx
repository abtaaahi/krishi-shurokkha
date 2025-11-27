import WeatherCard from "./WeatherCard";

interface Props {
  daily: {
    date: number;
    temp: number;
    humidity: number;
    rain: number;
  }[];
}

export default function WeatherForecast({ daily }: Props) {
  return (
    <div className="flex flex-col gap-4 pb-2">
      {daily.slice(0, 5).map((day) => (
        <div key={day.date} className="w-full">
          <WeatherCard day={day} />
        </div>
      ))}
    </div>
  );
}
