import { Colors } from "@/constants/colors";
import { defaultQuotes } from "@/constants/quotes";
import { StyleSheet, Text, View } from "react-native";

function getDailyQuoteIndex(): number {
  const now = new Date();
  const daysSinceEpoch = Math.floor(now.getTime() / (1000 * 60 * 60 * 24));
  return daysSinceEpoch % defaultQuotes.length;
}

export function Quote() {
  const index = getDailyQuoteIndex();
  const quote = defaultQuotes[index];

  return (
    <View style={styles.container}>
      <View style={styles.quoteBox}>
        <Text style={styles.quoteText}>&ldquo;{quote.text}&rdquo;</Text>
        <Text style={styles.author}>— {quote.author}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
    paddingVertical: 24,
  },
  quoteBox: {
    paddingTop: 24,
  },
  quoteText: {
    fontSize: 28,
    fontWeight: "300",
    fontStyle: "italic",
    color: Colors.text,
    lineHeight: 40,
  },
  author: {
    fontSize: 22,
    fontWeight: "400",
    color: Colors.textSecondary,
    marginTop: 12,
  },
});
