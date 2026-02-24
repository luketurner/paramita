import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useKeepAwake } from "expo-keep-awake";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useConfig } from "@/hooks/useConfig";
import { DateTime } from "@/components/DateTime";
import { Weather } from "@/components/Weather";
import { Quote } from "@/components/Quote";

export default function Dashboard() {
  useKeepAwake();
  const { config, loaded } = useConfig();
  const router = useRouter();

  if (!loaded) {
    return (
      <View style={styles.screen}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.topRow}>
        <View style={styles.dateTimePanel}>
          <DateTime />
        </View>
        <View style={styles.divider} />
        <View style={styles.weatherPanel}>
          <Weather
            latitude={config.latitude}
            longitude={config.longitude}
            locationName={config.locationName}
          />
        </View>
      </View>
      <View style={styles.bottomRow}>
        <Quote quotes={config.quotes} />
      </View>
      <Pressable
        style={styles.settingsButton}
        onPress={() => router.push("/settings")}
      >
        <Ionicons name="settings-outline" size={28} color={Colors.muted} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topRow: {
    flex: 1,
    flexDirection: "row",
  },
  dateTimePanel: {
    flex: 1,
  },
  divider: {
    width: 2,
    backgroundColor: Colors.border,
    marginVertical: 32,
  },
  weatherPanel: {
    flex: 1,
  },
  bottomRow: {
    paddingBottom: 16,
  },
  settingsButton: {
    position: "absolute",
    bottom: 16,
    right: 24,
    padding: 8,
  },
  loadingText: {
    fontSize: 24,
    color: Colors.muted,
    textAlign: "center",
    marginTop: 100,
  },
});
