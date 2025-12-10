import { StyleSheet, Text, View } from "react-native";

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore</Text>
      <Text style={styles.sub}>Coming Soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6F2FF",
  },
  title: {
    fontSize: 30,
    fontWeight: "600",
    color: "#7E5BEF",
    marginBottom: 10,
  },
  sub: {
    fontSize: 18,
    color: "#666",
  },
});
