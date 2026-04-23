import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/theme';

export default function StatPill({ label, value, tone = 'default' }) {
  const toneStyle = tone === 'success' ? styles.success : tone === 'warning' ? styles.warning : tone === 'danger' ? styles.danger : styles.defaultTone;
  return (
    <View style={[styles.pill, toneStyle]}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { flex: 1, borderRadius: 18, paddingVertical: 12, paddingHorizontal: 10, minWidth: 96 },
  defaultTone: { backgroundColor: '#16243b' },
  success: { backgroundColor: '#0c2f2a' },
  warning: { backgroundColor: '#382910' },
  danger: { backgroundColor: '#331321' },
  value: { color: '#fff', fontWeight: '800', fontSize: 18 },
  label: { color: colors.subtext, marginTop: 4, fontSize: 12 }
});
