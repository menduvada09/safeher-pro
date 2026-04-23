import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Screen from '../components/Screen';
import SectionCard from '../components/SectionCard';
import HistoryItem from '../components/HistoryItem';
import { AppContext } from '../context/AppContext';
import { colors } from '../constants/theme';

export default function HistoryScreen() {
  const { history, locationHistory } = useContext(AppContext);

  return (
    <Screen>
      <SectionCard>
        <Text style={styles.title}>Activity history</Text>
        <Text style={styles.sub}>All important app actions are stored locally so you can show them in demo and review them later.</Text>
      </SectionCard>

      <SectionCard>
        <Text style={styles.title}>Recent events</Text>
        {history.length === 0 && <Text style={styles.empty}>No history yet.</Text>}
        <View style={styles.list}>
          {history.map((item) => <HistoryItem key={item.id} item={item} />)}
        </View>
      </SectionCard>

      <SectionCard>
        <Text style={styles.title}>Location history</Text>
        {locationHistory.length === 0 && <Text style={styles.empty}>No saved GPS points yet.</Text>}
        <View style={styles.list}>
          {locationHistory.map((item) => (
            <View key={item.id} style={styles.locCard}>
              <Text style={styles.locTitle}>{item.source}</Text>
              <Text style={styles.locText}>{item.latitude.toFixed(6)}, {item.longitude.toFixed(6)}</Text>
              <Text style={styles.locMeta}>Accuracy: {Math.round(item.accuracy || 0)} m • Speed: {(item.speed || 0).toFixed(1)} m/s</Text>
              <Text style={styles.locMeta}>{item.timeLabel}</Text>
            </View>
          ))}
        </View>
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 18, fontWeight: '800', marginBottom: 8 },
  sub: { color: colors.subtext, lineHeight: 20 },
  empty: { color: colors.muted },
  list: { gap: 10 },
  locCard: { backgroundColor: '#0f1830', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: colors.border },
  locTitle: { color: '#fff', fontWeight: '800' },
  locText: { color: colors.subtext, marginTop: 5 },
  locMeta: { color: colors.muted, marginTop: 4 }
});
