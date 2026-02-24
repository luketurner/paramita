import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/colors";
import { useConfig, geocodeZip } from "@/hooks/useConfig";

export default function Settings() {
  const { config, setConfig } = useConfig();
  const router = useRouter();
  const [zipInput, setZipInput] = useState(config.locationName);
  const [geocoding, setGeocoding] = useState(false);

  const handleSaveZip = async () => {
    if (!zipInput.trim()) {
      Alert.alert("Invalid Location", "Please enter a city or location name.");
      return;
    }
    setGeocoding(true);
    const result = await geocodeZip(zipInput.trim());
    setGeocoding(false);
    if (result) {
      setConfig({
        zipCode: zipInput.trim(),
        latitude: result.lat,
        longitude: result.lon,
        locationName: result.name,
      });
      Alert.alert("Location Updated", `Set to ${result.name}`);
    } else {
      Alert.alert("Error", "Could not find that location. Please try again.");
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Location</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Location</Text>
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            value={zipInput}
            onChangeText={setZipInput}
            placeholder="e.g. New York"
            placeholderTextColor={Colors.muted}
          />
          <Pressable
            style={[styles.button, geocoding && styles.buttonDisabled]}
            onPress={handleSaveZip}
            disabled={geocoding}
          >
            <Text style={styles.buttonText}>
              {geocoding ? "Looking up..." : "Save"}
            </Text>
          </Pressable>
        </View>
        <Text style={styles.hint}>
          Current: {config.locationName}
        </Text>
      </View>

      <Pressable
        style={[styles.button, styles.doneButton]}
        onPress={() => router.back()}
      >
        <Text style={styles.buttonText}>Done</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: Colors.text,
    marginTop: 24,
    marginBottom: 12,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: "500",
    color: Colors.text,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    color: Colors.text,
    backgroundColor: Colors.background,
    marginBottom: 8,
  },
  button: {
    backgroundColor: Colors.text,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: Colors.muted,
  },
  buttonText: {
    color: Colors.background,
    fontSize: 18,
    fontWeight: "600",
  },
  doneButton: {
    marginTop: 32,
  },
  hint: {
    fontSize: 14,
    color: Colors.muted,
    marginTop: 4,
  },
});
