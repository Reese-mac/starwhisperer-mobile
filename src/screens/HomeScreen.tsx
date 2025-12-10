import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen() {
  return (
    <LinearGradient
      colors={["#0B0F29", "#151B3D"]}
      style={styles.container}
    >
      <Text style={styles.title}>Minimal Moon Weather</Text>
      <Text style={styles.sub}>Today is calm and lunar-soft.</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>í¼•  Moon Phase</Text>
        <Text style={styles.cardValue}>Waxing Gibbous</Text>

        <View style={styles.row}>
          <View>
            <Text style={styles.label}>Temperature</Text>
            <Text style={styles.value}>21Â°C</Text>
          </View>
          <View>
            <Text style={styles.label}>Humidity</Text>
            <Text style={styles.value}>68%</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 120,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "600",
    textAlign: "center",
  },
  sub: {
    color: "#C9D2FF",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 40,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 20,
    padding: 20,
    borderColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
  },
  cardTitle: {
    color: "#C9D2FF",
    fontSize: 16,
    marginBottom: 8,
  },
  cardValue: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "600",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    color: "#AAB4E8",
    fontSize: 14,
  },
  value: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
  },
});
