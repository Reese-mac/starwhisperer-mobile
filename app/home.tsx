import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { getWeather } from '../api/WeatherService';

export default function HomeScreen() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      let lat: number;
      let lon: number;

      if (status !== 'granted') {
        console.log('GPS unavailable → using Taipei fallback.');
        lat = 25.033;
        lon = 121.5654;
      } else {
        const loc = await Location.getCurrentPositionAsync({});
        lat = loc.coords.latitude;
        lon = loc.coords.longitude;
      }

      try {
        const data = await getWeather(lat, lon);
        setWeather(data);
      } catch (error) {
        console.error('Failed to load weather', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading || !weather) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#6C4AFF" />
        <Text style={{ marginTop: 10, color: '#6C4AFF' }}>載入真實天氣中...</Text>
      </View>
    );
  }

  const current = weather.current;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.mainCard}>
        <Text style={styles.city}>{weather.city}</Text>
        <Text style={styles.temp}>{current.temp}°</Text>
        <Text style={styles.desc}>{current.weather}</Text>
      </View>

      <View style={styles.row}>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Feels Like</Text>
          <Text style={styles.infoValue}>{current.feels}°C</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Wind</Text>
          <Text style={styles.infoValue}>{current.wind} km/h</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>UV Index</Text>
          <Text style={styles.infoValue}>{current.uvi}</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Humidity</Text>
          <Text style={styles.infoValue}>{current.humidity}%</Text>
        </View>
      </View>

      <View style={styles.sunCard}>
        <Text style={styles.sunTitle}>Sunrise & Sunset</Text>
        <Text style={styles.sunText}>
          {new Date(current.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} /{' '}
          {new Date(current.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Hourly Forecast</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {weather.hourly.slice(0, 12).map((h: any, idx: number) => (
          <View key={idx} style={styles.hourCard}>
            <Text style={styles.hour}>{new Date(h.time * 1000).getHours()}:00</Text>
            <Text style={styles.hourTemp}>{Math.round(h.temp)}°</Text>
            <Text style={styles.hourUV}>UV {h.uvi}</Text>
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mainCard: {
    backgroundColor: '#DAD4FF',
    padding: 28,
    marginBottom: 20,
    borderRadius: 20,
  },
  city: { fontSize: 18, opacity: 0.7 },
  temp: { fontSize: 52, fontWeight: 'bold', marginTop: 4 },
  desc: { fontSize: 18, marginTop: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  infoCard: {
    backgroundColor: '#EDEAFF',
    width: '48%',
    padding: 20,
    borderRadius: 18,
    marginTop: 16,
  },
  infoLabel: { opacity: 0.7 },
  infoValue: { fontSize: 22, fontWeight: '600', marginTop: 4 },
  sunCard: {
    backgroundColor: '#EFE9FF',
    padding: 20,
    borderRadius: 18,
    marginTop: 20,
  },
  sunTitle: { opacity: 0.7 },
  sunText: { fontSize: 26, marginTop: 8, fontWeight: '600' },
  sectionTitle: { marginTop: 26, marginBottom: 10, fontSize: 18, fontWeight: '600' },
  hourCard: {
    backgroundColor: '#EEE9FF',
    padding: 14,
    borderRadius: 14,
    marginRight: 14,
    alignItems: 'center',
  },
  hour: { opacity: 0.7, marginBottom: 6 },
  hourTemp: { fontSize: 20, fontWeight: '600' },
  hourUV: { fontSize: 12, marginTop: 4, opacity: 0.6 },
});
