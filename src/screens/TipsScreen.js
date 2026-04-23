import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Screen from '../components/Screen';
import SectionCard from '../components/SectionCard';
import { safetyTips } from '../data/safetyTips';
import { colors } from '../constants/theme';

const gradients = {
  success: ['#0b3b33', '#0f5a4a'],
  warning: ['#4a2f05', '#7a4a06'],
  danger: ['#4b1327', '#7e1f40'],
  default: ['#14233a', '#1d3154']
};

export default function TipsScreen() {
  return (
    <Screen>
      <SectionCard style={{ paddingBottom: 8 }}>
        <Text style={styles.title}>Safety tips</Text>
        <Text style={styles.sub}>Quick, practical guidance designed for daily use. These cards are styled for presentation and demo clarity.</Text>
      </SectionCard>
      {safetyTips.map((tip, index) => (
        <LinearGradient key={index} colors={gradients[tip.tone] || gradients.default} style={styles.tipCard}>
          <View style={styles.tipNumber}><Text style={styles.tipNumberText}>{index + 1}</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.tipTitle}>{tip.title}</Text>
            <Text style={styles.tipText}>{tip.text}</Text>
          </View>
        </LinearGradient>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 18, fontWeight: '800' },
  sub: { color: colors.subtext, marginTop: 8, lineHeight: 20 },
  tipCard: { borderRadius: 22, padding: 16, flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  tipNumber: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.14)', alignItems: 'center', justifyContent: 'center' },
  tipNumberText: { color: '#fff', fontWeight: '900' },
  tipTitle: { color: '#fff', fontWeight: '800', fontSize: 16, marginBottom: 6 },
  tipText: { color: '#f0f5ff', lineHeight: 21 }
});
