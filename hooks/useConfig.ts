import { useCallback, useEffect, useState } from "react";
import { Storage } from "expo-sqlite/kv-store";
import { defaultQuotes, type Quote } from "@/constants/quotes";

export interface DashboardConfig {
  zipCode: string;
  latitude: number | null;
  longitude: number | null;
  locationName: string;
  quotes: Quote[];
}

const CONFIG_KEY = "dashboard_config";

const defaultConfig: DashboardConfig = {
  zipCode: "10001",
  latitude: 40.7484,
  longitude: -73.9967,
  locationName: "New York, NY",
  quotes: defaultQuotes,
};

export function useConfig() {
  const [config, setConfigState] = useState<DashboardConfig>(defaultConfig);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = Storage.getItemSync(CONFIG_KEY);
    if (stored) {
      try {
        setConfigState({ ...defaultConfig, ...JSON.parse(stored) });
      } catch {
        // use default
      }
    }
    setLoaded(true);
  }, []);

  const setConfig = useCallback((update: Partial<DashboardConfig>) => {
    setConfigState((prev) => {
      const next = { ...prev, ...update };
      Storage.setItemSync(CONFIG_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { config, setConfig, loaded };
}

export async function geocodeZip(
  zip: string
): Promise<{ lat: number; lon: number; name: string } | null> {
  try {
    const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
    if (!res.ok) return null;
    const data = await res.json();
    const place = data.places?.[0];
    if (!place) return null;
    return {
      lat: parseFloat(place.latitude),
      lon: parseFloat(place.longitude),
      name: `${place["place name"]}, ${place["state abbreviation"]}`,
    };
  } catch {
    return null;
  }
}
