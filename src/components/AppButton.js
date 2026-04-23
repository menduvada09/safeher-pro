import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { colors } from '../constants/theme';

export default function AppButton({ title, subtitle, onPress, variant = 'primary', disabled = false, compact = false }) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        compact && styles.compact,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        variant === 'danger' && styles.danger,
        disabled && styles.disabled,
        pressed && !disabled && { transform: [{ scale: 0.985 }], opacity: 0.92 }
      ]}
    >
      <View>
        <Text style={styles.text}>{title}</Text>
        {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56
  },
  compact: { minHeight: 46, paddingVertical: 10 },
  secondary: { backgroundColor: colors.card2 },
  ghost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border },
  danger: { backgroundColor: colors.dangerBg, borderWidth: 1, borderColor: '#6e2240' },
  disabled: { opacity: 0.6 },
  text: { color: '#fff', fontWeight: '800', fontSize: 15, textAlign: 'center' },
  subtitle: { color: '#ffd9e2', fontSize: 12, marginTop: 2, textAlign: 'center' }
});
