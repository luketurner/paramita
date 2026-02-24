import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Colors } from "@/constants/colors";
import { geocodeZip, type DashboardConfig } from "@/hooks/useConfig";

interface LocationModalProps {
  visible: boolean;
  onClose: () => void;
  currentLocationName: string;
  onSave: (update: Partial<DashboardConfig>) => void;
}

export function LocationModal({
  visible,
  onClose,
  currentLocationName,
  onSave,
}: LocationModalProps) {
  const [input, setInput] = useState(currentLocationName);
  const [geocoding, setGeocoding] = useState(false);

  useEffect(() => {
    if (visible) setInput(currentLocationName);
  }, [visible, currentLocationName]);

  const handleSave = async () => {
    if (!input.trim()) {
      Alert.alert("Invalid Location", "Please enter a city or location name.");
      return;
    }
    setGeocoding(true);
    const result = await geocodeZip(input.trim());
    setGeocoding(false);
    if (result) {
      onSave({
        zipCode: input.trim(),
        latitude: result.lat,
        longitude: result.lon,
        locationName: result.name,
      });
      onClose();
    } else {
      Alert.alert("Error", "Could not find that location. Please try again.");
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.card} onStartShouldSetResponder={() => true}>
          <Text style={styles.title}>Set Location</Text>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="e.g. New York"
            placeholderTextColor={Colors.muted}
            autoFocus
          />
          <Text style={styles.hint}>Current: {currentLocationName}</Text>
          <View style={styles.buttons}>
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.saveButton, geocoding && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={geocoding}
            >
              <Text style={styles.saveText}>
                {geocoding ? "Looking up..." : "Save"}
              </Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 24,
    width: 360,
    maxWidth: "90%",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    color: Colors.text,
    backgroundColor: Colors.background,
  },
  hint: {
    fontSize: 14,
    color: Colors.muted,
    marginTop: 8,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelText: {
    fontSize: 16,
    color: Colors.text,
  },
  saveButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: Colors.text,
  },
  buttonDisabled: {
    backgroundColor: Colors.muted,
  },
  saveText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.background,
  },
});
