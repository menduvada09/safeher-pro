import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/theme';

export default function HistoryItem({ item }) {
  return (
    <View style={styles.item}>
      <View style={styles.row}>
        <Text style={styles.type}>{item.type}</Text>
        <Text style={styles.time}>{item.timeLabel}</Text>
      </View>
      {!!item.title && <Text style={styles.title}>{item.title}</Text>}
      {!!item.detail && <Text style={styles.detail}>{item.detail}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    borderRadius: 16,
    backgroundColor: '#0f1830',
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  type: { color: '#fff', fontWeight: '800' },
  time: { color: colors.muted, fontSize: 12 },
  title: { color: colors.subtext, fontWeight: '700' },
  detail: { color: colors.muted, lineHeight: 20 }
});
