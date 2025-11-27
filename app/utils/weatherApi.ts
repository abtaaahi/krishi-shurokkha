const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY!;

export async function getLatLon(upazilaName: string) {
  const res = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${upazilaName},BD&limit=1&appid=${API_KEY}`
  );
  const data = await res.json();
  if (!data || data.length === 0) throw new Error("Location not found");
  return { lat: data[0].lat, lon: data[0].lon };
}

export async function getWeather(lat: number, lon: number) {
  const res = await fetch(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&appid=${API_KEY}`
  );
  const data = await res.json();
  return data;
}
