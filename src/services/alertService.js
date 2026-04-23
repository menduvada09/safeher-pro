import { Alert, Linking, Platform } from 'react-native';

export function buildSOSMessage(coords, scoreLabel = 'Unknown') {
  const mapLink = coords ? `https://maps.google.com/?q=${coords.latitude},${coords.longitude}` : 'Location unavailable';
  return `Hey, I am in danger. Please help me immediately. Safety status: ${scoreLabel}. My location: ${mapLink}`;
}

export async function openCall(number) {
  if (!number) {
    Alert.alert('No emergency number', 'Please add a trusted contact first.');
    return;
  }
  const url = `tel:${number}`;
  const can = await Linking.canOpenURL(url);
  if (can) {
    await Linking.openURL(url);
  } else {
    Alert.alert('Call failed', 'Unable to open dialer on this device.');
  }
}

export async function openSms(numbers, message) {
  if (!numbers?.length) {
    Alert.alert('No contacts found', 'Please add at least one trusted contact first.');
    return;
  }
  const recipient = numbers.join(',');
  const url = Platform.OS === 'ios'
    ? `sms:${recipient}&body=${encodeURIComponent(message)}`
    : `sms:${recipient}?body=${encodeURIComponent(message)}`;
  const can = await Linking.canOpenURL(url);
  if (can) {
    await Linking.openURL(url);
  } else {
    Alert.alert('SMS failed', 'Unable to open messaging app on this device.');
  }
}
