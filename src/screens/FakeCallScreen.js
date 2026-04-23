import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Screen from '../components/Screen';
import AppButton from '../components/AppButton';
import { AppContext } from '../context/AppContext';
import { colors } from '../constants/theme';

export default function FakeCallScreen({ closeFakeCall }) {
  const { settings } = useContext(AppContext);
  return (
    <Screen>
      <LinearGradient colors={['#0f182e', '#1d2a4a']} style={styles.card}>
        <Text style={styles.calling}>Incoming Call</Text>
        <Text style={styles.name}>{settings.fakeCallerName || 'Mom'}</Text>
        <Text style={styles.sub}>Use this screen to quickly exit an unsafe social situation.</Text>
        <View style={styles.row}>
          <View style={{ flex: 1 }}><AppButton title="Decline" variant="danger" onPress={closeFakeCall} /></View>
          <View style={{ width: 12 }} />
          <View style={{ flex: 1 }}><AppButton title="Receive" onPress={closeFakeCall} /></View>
        </View>
      </LinearGradient>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { minHeight: 540, alignItems: 'center', justifyContent: 'center', borderRadius: 28, padding: 24 },
  calling: { color: colors.subtext, fontSize: 18 },
  name: { color: colors.text, fontSize: 44, fontWeight: '900', marginTop: 14, textAlign: 'center' },
  sub: { color: colors.subtext, marginTop: 10, marginBottom: 24, textAlign: 'center', lineHeight: 20 },
  row: { flexDirection: 'row', width: '100%' }
});
