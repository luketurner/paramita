import { useQuery, useQueryClient } from "@tanstack/react-query";

export interface WeatherData {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  humidity: number;
  highTemp: number;
  lowTemp: number;
}

const EIGHT_HOURS_MS = 8 * 60 * 60 * 1000;

const WMO_DESCRIPTIONS: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Slight showers",
  81: "Moderate showers",
  82: "Violent showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm w/ slight hail",
  99: "Thunderstorm w/ heavy hail",
};

export function getWeatherDescription(code: number): string {
  return WMO_DESCRIPTIONS[code] ?? "Unknown";
}

export function getWeatherIcon(code: number): string {
  if (code === 0) return "☀";
  if (code <= 3) return "⛅";
  if (code <= 48) return "🌫";
  if (code <= 57) return "🌧";
  if (code <= 67) return "🌧";
  if (code <= 77) return "❄";
  if (code <= 82) return "🌧";
  if (code <= 86) return "❄";
  return "⛈";
}

async function fetchWeather(
  lat: number,
  lon: number
): Promise<WeatherData> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", lat.toString());
  url.searchParams.set("longitude", lon.toString());
  url.searchParams.set(
    "current",
    "temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m"
  );
  url.searchParams.set("daily", "temperature_2m_max,temperature_2m_min");
  url.searchParams.set("temperature_unit", "fahrenheit");
  url.searchParams.set("wind_speed_unit", "mph");
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", "1");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
  const data = await res.json();

  return {
    temperature: Math.round(data.current.temperature_2m),
    weatherCode: data.current.weather_code,
    windSpeed: Math.round(data.current.wind_speed_10m),
    humidity: data.current.relative_humidity_2m,
    highTemp: Math.round(data.daily.temperature_2m_max[0]),
    lowTemp: Math.round(data.daily.temperature_2m_min[0]),
  };
}

export function useWeather(lat: number | null, lon: number | null) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["weather", lat, lon],
    queryFn: () => fetchWeather(lat!, lon!),
    enabled: lat != null && lon != null,
    staleTime: EIGHT_HOURS_MS,
    gcTime: EIGHT_HOURS_MS,
    refetchInterval: EIGHT_HOURS_MS,
    retry: 3,
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["weather", lat, lon] });
  };

  return { ...query, refresh };
}
