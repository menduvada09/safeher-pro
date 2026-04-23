import React, { useContext, useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View, Pressable } from 'react-native';
import Screen from '../components/Screen';
import SectionCard from '../components/SectionCard';
import AppButton from '../components/AppButton';
import { AppContext } from '../context/AppContext';
import { colors } from '../constants/theme';
import { digitsOnly } from '../utils/formatters';

export default function ContactsScreen() {
  const { contacts, addContact, removeContact } = useContext(AppContext);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const cleanedPhone = useMemo(() => digitsOnly(phone).slice(0, 15), [phone]);

  async function handleAdd() {
    if (!name.trim()) {
      Alert.alert('Name required', 'Please enter a contact name.');
      return;
    }
    if (cleanedPhone.length < 10) {
      Alert.alert('Invalid number', 'Please enter at least 10 digits.');
      return;
    }
    await addContact({ name: name.trim(), phone: cleanedPhone });
    setName('');
    setPhone('');
  }

  return (
    <Screen>
      <SectionCard>
        <Text style={styles.title}>Trusted contacts</Text>
        <Text style={styles.sub}>Only digits are accepted in the phone field. The first saved contact is used as the primary SOS call target.</Text>
        <TextInput style={styles.input} placeholder="Contact name" placeholderTextColor="#92a1c6" value={name} onChangeText={setName} />
        <TextInput
          style={styles.input}
          placeholder="Phone number"
          placeholderTextColor="#92a1c6"
          value={cleanedPhone}
          onChangeText={(value) => setPhone(digitsOnly(value))}
          keyboardType="number-pad"
          maxLength={15}
        />
        <AppButton title="Add Contact" subtitle="Saved locally in app history" onPress={handleAdd} />
      </SectionCard>

      <SectionCard>
        <Text style={styles.title}>Saved contacts</Text>
        {contacts.length === 0 && <Text style={styles.empty}>No trusted contacts added yet.</Text>}
        {contacts.map((item, index) => (
          <View key={item.id} style={styles.row}>
            <View style={{ flex: 1 }}>
              <View style={styles.badgeRow}>
                <Text style={styles.name}>{item.name}</Text>
                {index === 0 && <Text style={styles.primaryTag}>PRIMARY</Text>}
              </View>
              <Text style={styles.phone}>{item.phone}</Text>
            </View>
            <Pressable onPress={() => removeContact(item.id)} style={styles.remove}><Text style={styles.removeTxt}>Remove</Text></Pressable>
          </View>
        ))}
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 18, fontWeight: '800', marginBottom: 8 },
  sub: { color: colors.subtext, lineHeight: 20, marginBottom: 12 },
  input: { backgroundColor: '#10172a', borderColor: colors.border, borderWidth: 1, borderRadius: 14, color: colors.text, paddingHorizontal: 14, paddingVertical: 13, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomColor: colors.border, borderBottomWidth: 1, gap: 10 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  name: { color: colors.text, fontWeight: '800', fontSize: 16 },
  primaryTag: { backgroundColor: '#1c3653', color: '#b9e7ff', fontSize: 11, fontWeight: '800', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  phone: { color: colors.subtext, marginTop: 4 },
  remove: { backgroundColor: '#3b1d28', paddingHorizontal: 12, paddingVertical: 9, borderRadius: 10 },
  removeTxt: { color: '#ffd9e1', fontWeight: '700' },
  empty: { color: colors.muted }
});
