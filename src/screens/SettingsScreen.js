import React, { useContext } from 'react';
import { StyleSheet, Text, Switch, View, TextInput } from 'react-native';
import Screen from '../components/Screen';
import SectionCard from '../components/SectionCard';
import { AppContext } from '../context/AppContext';
import { colors } from '../constants/theme';

export default function SettingsScreen() {
  const { settings, updateSettings, isTracking } = useContext(AppContext);

  return (
    <Screen>
      <SectionCard>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Shake detection SOS</Text>
            <Text style={styles.note}>On Android build, shaking the phone triggers SOS after cooldown.</Text>
          </View>
          <Switch value={settings.shakeEnabled} onValueChange={(value) => updateSettings({ shakeEnabled: value })} />
        </View>
      </SectionCard>

      <SectionCard>
        <Text style={styles.title}>Fake call display name</Text>
        <TextInput
          style={styles.input}
          placeholder="Caller name"
          placeholderTextColor="#92a1c6"
          value={settings.fakeCallerName}
          onChangeText={(value) => updateSettings({ fakeCallerName: value || 'Mom' })}
        />
      </SectionCard>

      <SectionCard>
        <Text style={styles.title}>System status</Text>
        <Text style={styles.note}>Live tracking: {isTracking ? 'Running' : 'Stopped'}</Text>
        <Text style={styles.note}>Data storage: Contacts, SOS events, and location history are stored locally with AsyncStorage.</Text>
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 18, fontWeight: '800', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  label: { color: colors.text, fontWeight: '700' },
  note: { color: colors.subtext, marginTop: 6, lineHeight: 20 },
  input: { backgroundColor: '#10172a', borderColor: colors.border, borderWidth: 1, borderRadius: 14, color: colors.text, paddingHorizontal: 14, paddingVertical: 13 }
});
