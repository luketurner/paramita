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
import type { Quote } from "@/constants/quotes";

export default function Settings() {
  const { config, setConfig } = useConfig();
  const router = useRouter();
  const [zipInput, setZipInput] = useState(config.locationName);
  const [geocoding, setGeocoding] = useState(false);
  const [newQuoteText, setNewQuoteText] = useState("");
  const [newQuoteAuthor, setNewQuoteAuthor] = useState("");

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

  const handleAddQuote = () => {
    const text = newQuoteText.trim();
    const author = newQuoteAuthor.trim();
    if (!text) {
      Alert.alert("Missing Quote", "Please enter the quote text.");
      return;
    }
    const newQuote: Quote = { text, author: author || "Unknown" };
    setConfig({ quotes: [...config.quotes, newQuote] });
    setNewQuoteText("");
    setNewQuoteAuthor("");
  };

  const handleRemoveQuote = (index: number) => {
    const updated = config.quotes.filter((_, i) => i !== index);
    setConfig({ quotes: updated });
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

      <Text style={styles.sectionTitle}>Quotes</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Add New Quote</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={newQuoteText}
          onChangeText={setNewQuoteText}
          placeholder="Enter quote text..."
          placeholderTextColor={Colors.muted}
          multiline
        />
        <TextInput
          style={styles.input}
          value={newQuoteAuthor}
          onChangeText={setNewQuoteAuthor}
          placeholder="Author (optional)"
          placeholderTextColor={Colors.muted}
        />
        <Pressable style={styles.button} onPress={handleAddQuote}>
          <Text style={styles.buttonText}>Add Quote</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>
          Current Quotes ({config.quotes.length})
        </Text>
        {config.quotes.map((q, i) => (
          <View key={i} style={styles.quoteItem}>
            <View style={styles.quoteContent}>
              <Text style={styles.quoteText}>&ldquo;{q.text}&rdquo;</Text>
              <Text style={styles.quoteAuthor}>— {q.author}</Text>
            </View>
            <Pressable
              style={styles.removeButton}
              onPress={() => handleRemoveQuote(i)}
            >
              <Text style={styles.removeText}>✕</Text>
            </Pressable>
          </View>
        ))}
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
  multilineInput: {
    minHeight: 80,
    textAlignVertical: "top",
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
  quoteItem: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: 12,
    gap: 12,
  },
  quoteContent: {
    flex: 1,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: "italic",
    color: Colors.text,
  },
  quoteAuthor: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  removeButton: {
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  removeText: {
    fontSize: 20,
    color: Colors.muted,
  },
});
