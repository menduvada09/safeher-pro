import AsyncStorage from '@react-native-async-storage/async-storage';

const CONTACTS_KEY = 'safeher_contacts_v2';
const SETTINGS_KEY = 'safeher_settings_v2';
const HISTORY_KEY = 'safeher_history_v2';
const LOCATION_LOG_KEY = 'safeher_location_log_v2';

const defaultContacts = [
  { id: '1', name: 'Mom', phone: '9876543210' },
  { id: '2', name: 'Friend', phone: '9123456780' }
];

export async function loadContacts() {
  try {
    const raw = await AsyncStorage.getItem(CONTACTS_KEY);
    return raw ? JSON.parse(raw) : defaultContacts;
  } catch {
    return defaultContacts;
  }
}

export async function saveContacts(contacts) {
  await AsyncStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
}

export async function loadSettings() {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : { shakeEnabled: true, fakeCallerName: 'Mom' };
  } catch {
    return { shakeEnabled: true, fakeCallerName: 'Mom' };
  }
}

export async function saveSettings(settings) {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export async function loadHistory() {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveHistory(history) {
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export async function loadLocationLog() {
  try {
    const raw = await AsyncStorage.getItem(LOCATION_LOG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveLocationLog(history) {
  await AsyncStorage.setItem(LOCATION_LOG_KEY, JSON.stringify(history));
}
