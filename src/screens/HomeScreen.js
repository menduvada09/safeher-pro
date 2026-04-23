import React, { useContext } from 'react';
import { StyleSheet, Text, View, Platform, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Screen from '../components/Screen';
import SectionCard from '../components/SectionCard';
import AppButton from '../components/AppButton';
import StatPill from '../components/StatPill';
import { AppContext } from '../context/AppContext';
import { colors } from '../constants/theme';
import { formatCoords } from '../utils/formatters';

export default function HomeScreen({ openFakeCall, goToContacts, goToHistory }) {
  const { coords, loadingLocation, refreshLocation, safety, sendSOS, contacts, isTracking, startLiveTracking, stopLiveTracking, locationHistory } = useContext(AppContext);

  const tone = safety.label === 'Safe' ? 'success' : safety.label === 'Caution' ? 'warning' : 'danger';

  return (
    <Screen>
      <LinearGradient colors={['#8b1238', '#3d0d2a']} style={styles.hero}>
        <View style={styles.badge}><Text style={styles.badgeText}>SAFEHER PRO</Text></View>
        <Text style={styles.title}>Stay connected. Stay protected.</Text>
        <Text style={styles.subtitle}>Live status updates, trusted contacts, SOS calling flow, and history tracking.</Text>
        <View style={styles.heroRow}>
          <StatPill label="Safety score" value={`${safety.score}/100`} tone={tone} />
          <StatPill label="Contacts" value={String(contacts.length)} />
          <StatPill label="Tracking" value={isTracking ? 'ON' : 'OFF'} tone={isTracking ? 'success' : 'warning'} />
        </View>
      </LinearGradient>

      <SectionCard>
        <Text style={styles.cardTitle}>Emergency control</Text>
        <View style={styles.grid}>
          <AppButton title="SOS Call + Message" subtitle="Calls primary contact, then opens message" onPress={() => sendSOS('Home screen button')} variant="danger" />
          <AppButton title="Refresh Exact Location" subtitle={loadingLocation ? 'Getting latest GPS...' : 'Fetch latest coordinates now'} onPress={refreshLocation} variant="secondary" disabled={loadingLocation} />
          <AppButton title={isTracking ? 'Stop Live Tracking' : 'Start Live Tracking'} subtitle="Auto-updates live status" onPress={isTracking ? stopLiveTracking : startLiveTracking} variant="secondary" />
          <AppButton title="Fake Call" subtitle="Quick exit screen" onPress={openFakeCall} variant="secondary" />
          <AppButton title="Trusted Contacts" subtitle="Manage emergency numbers" onPress={goToContacts} variant="ghost" />
          <AppButton title="History" subtitle="See alerts, contacts, locations" onPress={goToHistory} variant="ghost" />
        </View>
      </SectionCard>

      <SectionCard>
        <Text style={styles.cardTitle}>Live status</Text>
        <View style={styles.statusBox}>
          <Text style={styles.statusLabel}>Current state</Text>
          <Text style={styles.statusValue}>{safety.label}</Text>
        </View>
        <View style={styles.statusRow}><Text style={styles.label}>Platform</Text><Text style={styles.value}>{Platform.OS}</Text></View>
        <View style={styles.statusRow}><Text style={styles.label}>Current coordinates</Text><Text style={styles.value}>{formatCoords(coords)}</Text></View>
        <View style={styles.statusRow}><Text style={styles.label}>Accuracy</Text><Text style={styles.value}>{coords?.accuracy ? `${Math.round(coords.accuracy)} m` : 'Unknown'}</Text></View>
        <View style={styles.statusRow}><Text style={styles.label}>Speed</Text><Text style={styles.value}>{coords?.speed ? `${coords.speed.toFixed(1)} m/s` : '0 m/s'}</Text></View>
        <View style={styles.statusRow}><Text style={styles.label}>Tracking updates saved</Text><Text style={styles.value}>{String(locationHistory.length)}</Text></View>
        {!!coords && (
          <AppButton
            title="Open on Map"
            subtitle="View current point in maps"
            onPress={() => Linking.openURL(`https://maps.google.com/?q=${coords.latitude},${coords.longitude}`)}
            variant="secondary"
          />
        )}
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { borderRadius: 24, padding: 18, gap: 10 },
  badge: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '800', letterSpacing: 0.6 },
  title: { color: colors.text, fontSize: 28, fontWeight: '900', lineHeight: 34 },
  subtitle: { color: '#ffd9e2', fontSize: 14, lineHeight: 20 },
  heroRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', marginTop: 4 },
  cardTitle: { color: colors.text, fontWeight: '800', fontSize: 18, marginBottom: 14 },
  grid: { gap: 10 },
  statusBox: { backgroundColor: '#10172d', borderRadius: 16, padding: 14, marginBottom: 12 },
  statusLabel: { color: colors.muted, fontSize: 12 },
  statusValue: { color: '#fff', fontWeight: '900', fontSize: 24, marginTop: 4 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  label: { color: colors.subtext, flex: 1 },
  value: { color: '#fff', flex: 1, textAlign: 'right', fontWeight: '700' }
});
