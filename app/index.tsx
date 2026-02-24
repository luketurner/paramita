import { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { Colors } from "@/constants/colors";
import { useConfig } from "@/hooks/useConfig";
import { DateTime } from "@/components/DateTime";
import { Weather } from "@/components/Weather";
import { Quote } from "@/components/Quote";
import { LocationModal } from "@/components/LocationModal";

export default function Dashboard() {
  useEffect(() => {
    if (Platform.OS === "web") return;
    activateKeepAwakeAsync();
    return () => { deactivateKeepAwake(); };
  }, []);
  const { config, setConfig, loaded } = useConfig();
  const [locationModalVisible, setLocationModalVisible] = useState(false);

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
        <View style={styles.weatherPanel}>
          <Weather
            latitude={config.latitude}
            longitude={config.longitude}
            locationName={config.locationName}
            onLongPress={() => setLocationModalVisible(true)}
          />
        </View>
      </View>
      <View style={styles.bottomRow}>
        <Quote />
      </View>
      <LocationModal
        visible={locationModalVisible}
        onClose={() => setLocationModalVisible(false)}
        currentLocationName={config.locationName}
        onSave={(update) => setConfig(update)}
      />
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
  weatherPanel: {
    flex: 1,
  },
  bottomRow: {
    paddingBottom: 16,
  },
  loadingText: {
    fontSize: 24,
    color: Colors.muted,
    textAlign: "center",
    marginTop: 100,
  },
});
