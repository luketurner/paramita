import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/colors";
import {
  getWeatherDescription,
  getWeatherIcon,
  useWeather,
} from "@/hooks/useWeather";

interface WeatherProps {
  latitude: number | null;
  longitude: number | null;
  locationName: string;
  onLongPress?: () => void;
}

export function Weather({ latitude, longitude, locationName, onLongPress }: WeatherProps) {
  const { data, isLoading, isError, refresh, dataUpdatedAt } = useWeather(
    latitude,
    longitude
  );

  if (latitude == null || longitude == null) {
    return (
      <Pressable style={styles.container} onLongPress={onLongPress}>
        <Text style={styles.errorText}>
          Long-press to set your location
        </Text>
      </Pressable>
    );
  }

  if (isLoading && !data) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.text} />
        <Text style={styles.loadingText}>Loading weather...</Text>
      </View>
    );
  }

  if (isError && !data) {
    return (
      <Pressable style={styles.container} onPress={refresh} onLongPress={onLongPress}>
        <Text style={styles.errorText}>Failed to load weather</Text>
      </Pressable>
    );
  }

  if (!data) return null;

  const updatedAt = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

  return (
    <Pressable style={styles.container} onPress={refresh} onLongPress={onLongPress}>
      <Text style={styles.location}>{locationName}</Text>
      <Text style={styles.icon}>{getWeatherIcon(data.weatherCode)}</Text>
      <Text style={styles.temperature}>{data.temperature}°F</Text>
      <Text style={styles.description}>
        {getWeatherDescription(data.weatherCode)}
      </Text>
      <View style={styles.details}>
        <Text style={styles.detailText}>
          H: {data.highTemp}° L: {data.lowTemp}°
        </Text>
        {data.precipitationProbability > 0 && (
          <Text style={styles.detailText}>
            Rain: {data.precipitationProbability}%
          </Text>
        )}
      </View>
      <Text style={styles.updated}>Updated {updatedAt}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  location: {
    fontSize: 24,
    fontWeight: "500",
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  icon: {
    fontSize: 64,
    marginBottom: 4,
  },
  temperature: {
    fontSize: 72,
    fontWeight: "200",
    color: Colors.text,
  },
  description: {
    fontSize: 28,
    fontWeight: "400",
    color: Colors.text,
    marginTop: 4,
  },
  details: {
    marginTop: 16,
    gap: 4,
  },
  detailText: {
    fontSize: 22,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  updated: {
    fontSize: 16,
    color: Colors.muted,
    marginTop: 16,
  },
  loadingText: {
    fontSize: 20,
    color: Colors.muted,
    marginTop: 12,
  },
  errorText: {
    fontSize: 22,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
