import { StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/colors";
import type { Quote as QuoteType } from "@/constants/quotes";

interface QuoteProps {
  quotes: QuoteType[];
}

function getDailyQuoteIndex(quotes: QuoteType[]): number {
  if (quotes.length === 0) return 0;
  const now = new Date();
  const daysSinceEpoch = Math.floor(now.getTime() / (1000 * 60 * 60 * 24));
  return daysSinceEpoch % quotes.length;
}

export function Quote({ quotes }: QuoteProps) {
  if (quotes.length === 0) {
    return null;
  }

  const index = getDailyQuoteIndex(quotes);
  const quote = quotes[index];

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
    borderTopWidth: 2,
    borderTopColor: Colors.border,
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
    textAlign: "right",
  },
});
