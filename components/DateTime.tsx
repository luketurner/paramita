import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { format } from "date-fns";
import { Colors } from "@/constants/colors";

export function DateTime() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.dayOfWeek}>{format(now, "EEEE")}</Text>
      <Text style={styles.date}>{format(now, "MMMM d, yyyy")}</Text>
      <Text style={styles.time}>{format(now, "h:mm a")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  dayOfWeek: {
    fontSize: 48,
    fontWeight: "300",
    color: Colors.text,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  date: {
    fontSize: 36,
    fontWeight: "400",
    color: Colors.text,
    marginTop: 8,
  },
  time: {
    fontSize: 72,
    fontWeight: "200",
    color: Colors.text,
    marginTop: 16,
  },
});
