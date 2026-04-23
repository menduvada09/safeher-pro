import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import ContactsScreen from './screens/ContactsScreen';
import TipsScreen from './screens/TipsScreen';
import SettingsScreen from './screens/SettingsScreen';
import FakeCallScreen from './screens/FakeCallScreen';
import HistoryScreen from './screens/HistoryScreen';
import { colors } from './constants/theme';

const TABS = ['Home', 'Contacts', 'Tips', 'History', 'Settings'];

export default function RootApp() {
  const [tab, setTab] = useState('Home');
  const [fakeCallVisible, setFakeCallVisible] = useState(false);

  let content;
  if (fakeCallVisible) {
    content = <FakeCallScreen closeFakeCall={() => setFakeCallVisible(false)} />;
  } else if (tab === 'Home') {
    content = (
      <HomeScreen
        openFakeCall={() => setFakeCallVisible(true)}
        goToContacts={() => setTab('Contacts')}
        goToHistory={() => setTab('History')}
      />
    );
  } else if (tab === 'Contacts') {
    content = <ContactsScreen />;
  } else if (tab === 'Tips') {
    content = <TipsScreen />;
  } else if (tab === 'History') {
    content = <HistoryScreen />;
  } else {
    content = <SettingsScreen />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>{content}</View>
      {!fakeCallVisible && (
        <View style={styles.tabBar}>
          {TABS.map((item) => {
            const active = item === tab;
            return (
              <Pressable key={item} onPress={() => setTab(item)} style={[styles.tabBtn, active && styles.activeTab]}>
                <Text style={[styles.tabText, active && styles.activeTabText]}>{item}</Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1 },
  tabBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#0c1528',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 8,
    paddingVertical: 10,
    justifyContent: 'space-between'
  },
  tabBtn: {
    minWidth: '18%',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginHorizontal: 3,
    marginVertical: 3
  },
  activeTab: { backgroundColor: colors.primary },
  tabText: { color: colors.subtext, fontWeight: '800', fontSize: 12 },
  activeTabText: { color: '#fff' }
});
