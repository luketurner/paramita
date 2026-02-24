import { useCallback, useEffect, useState } from "react";
import { Storage } from "expo-sqlite/kv-store";

export interface DashboardConfig {
  zipCode: string;
  latitude: number | null;
  longitude: number | null;
  locationName: string;
}

const CONFIG_KEY = "dashboard_config";

const defaultConfig: DashboardConfig = {
  zipCode: "10001",
  latitude: 40.7484,
  longitude: -73.9967,
  locationName: "New York, NY",
};

export function useConfig() {
  const [config, setConfigState] = useState<DashboardConfig>(defaultConfig);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Storage.getItem(CONFIG_KEY).then((stored) => {
      if (stored) {
        try {
          setConfigState({ ...defaultConfig, ...JSON.parse(stored) });
        } catch {
          // use default
        }
      }
      setLoaded(true);
    }).catch(() => {
      setLoaded(true);
    });
  }, []);

  const setConfig = useCallback((update: Partial<DashboardConfig>) => {
    setConfigState((prev) => {
      const next = { ...prev, ...update };
      Storage.setItem(CONFIG_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { config, setConfig, loaded };
}

export async function geocodeZip(
  query: string
): Promise<{ lat: number; lon: number; name: string } | null> {
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const result = data.results?.[0];
    if (!result) return null;
    return {
      lat: result.latitude,
      lon: result.longitude,
      name: result.admin1
        ? `${result.name}, ${result.admin1}`
        : result.name,
    };
  } catch {
    return null;
  }
}
