import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { loadContacts, loadHistory, loadLocationLog, loadSettings, saveContacts, saveHistory, saveLocationLog, saveSettings } from '../services/storage';
import { getCurrentLocation, startLocationWatch } from '../services/locationService';
import { buildSOSMessage, openCall, openSms } from '../services/alertService';
import { calculateSafetyScore } from '../utils/safetyScore';
import { formatTimeLabel } from '../utils/formatters';
import useShakeSOS from '../hooks/useShakeSOS';

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [contacts, setContacts] = useState([]);
  const [settings, setSettings] = useState({ shakeEnabled: true, fakeCallerName: 'Mom' });
  const [coords, setCoords] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [history, setHistory] = useState([]);
  const [locationHistory, setLocationHistory] = useState([]);
  const watchRef = useRef(null);

  useEffect(() => {
    (async () => {
      const [savedContacts, savedSettings, savedHistory, savedLocationHistory] = await Promise.all([
        loadContacts(),
        loadSettings(),
        loadHistory(),
        loadLocationLog()
      ]);
      setContacts(savedContacts);
      setSettings(savedSettings);
      setHistory(savedHistory);
      setLocationHistory(savedLocationHistory);
    })();
  }, []);

  const pushHistory = useCallback(async (entry) => {
    const item = {
      id: String(Date.now()) + Math.random().toString(36).slice(2, 7),
      ts: Date.now(),
      timeLabel: formatTimeLabel(Date.now()),
      ...entry
    };
    setHistory((prev) => {
      const next = [item, ...prev].slice(0, 120);
      saveHistory(next).catch(() => {});
      return next;
    });
  }, []);

  const pushLocationLog = useCallback(async (nextCoords, source = 'Tracking update') => {
    const item = {
      id: String(Date.now()) + Math.random().toString(36).slice(2, 7),
      ts: Date.now(),
      latitude: nextCoords.latitude,
      longitude: nextCoords.longitude,
      accuracy: nextCoords.accuracy || 0,
      speed: nextCoords.speed || 0,
      source,
      timeLabel: formatTimeLabel(Date.now())
    };
    setLocationHistory((prev) => {
      const next = [item, ...prev].slice(0, 60);
      saveLocationLog(next).catch(() => {});
      return next;
    });
  }, []);

  const refreshLocation = useCallback(async () => {
    try {
      setLoadingLocation(true);
      const current = await getCurrentLocation();
      setCoords(current);
      pushLocationLog(current, 'Manual refresh');
      pushHistory({ type: 'Location', title: 'Location refreshed', detail: `Accuracy ${Math.round(current.accuracy || 0)} m` });
      return current;
    } catch (error) {
      Alert.alert('Location error', error.message);
      pushHistory({ type: 'Location', title: 'Location refresh failed', detail: error.message });
      return null;
    } finally {
      setLoadingLocation(false);
    }
  }, [pushHistory, pushLocationLog]);

  const startLiveTracking = useCallback(async () => {
    if (watchRef.current) return;
    try {
      setLoadingLocation(true);
      const subscription = await startLocationWatch(
        (nextCoords) => {
          setCoords(nextCoords);
          pushLocationLog(nextCoords);
        },
        (error) => {
          pushHistory({ type: 'Tracking', title: 'Live tracking error', detail: error.message });
        }
      );
      watchRef.current = subscription;
      setIsTracking(true);
      pushHistory({ type: 'Tracking', title: 'Live tracking started', detail: Platform.OS === 'web' ? 'Browser GPS watcher enabled' : 'Device GPS watcher enabled' });
    } catch (error) {
      Alert.alert('Tracking error', error.message);
      pushHistory({ type: 'Tracking', title: 'Tracking start failed', detail: error.message });
    } finally {
      setLoadingLocation(false);
    }
  }, [pushHistory, pushLocationLog]);

  const stopLiveTracking = useCallback(() => {
    watchRef.current?.remove?.();
    watchRef.current = null;
    setIsTracking(false);
    pushHistory({ type: 'Tracking', title: 'Live tracking stopped', detail: 'Background location watch was stopped by user.' }).catch?.(() => {});
  }, [pushHistory]);

  useEffect(() => {
    refreshLocation();
    startLiveTracking();
    return () => {
      watchRef.current?.remove?.();
      watchRef.current = null;
    };
  }, [refreshLocation, startLiveTracking]);

  const addContact = async (contact) => {
    const next = [...contacts, { id: String(Date.now()), ...contact }];
    setContacts(next);
    await saveContacts(next);
    await pushHistory({ type: 'Contact', title: 'Trusted contact added', detail: `${contact.name} (${contact.phone})` });
  };

  const removeContact = async (id) => {
    const removed = contacts.find((item) => item.id === id);
    const next = contacts.filter((item) => item.id !== id);
    setContacts(next);
    await saveContacts(next);
    await pushHistory({ type: 'Contact', title: 'Trusted contact removed', detail: removed ? `${removed.name} (${removed.phone})` : 'Contact removed' });
  };

  const updateSettings = async (nextPartial) => {
    const next = { ...settings, ...nextPartial };
    setSettings(next);
    await saveSettings(next);
  };

  const safety = useMemo(() => {
    const hour = new Date().getHours();
    return calculateSafetyScore({
      hour,
      speed: coords?.speed || 0,
      hasLocation: Boolean(coords),
      isTracking,
      contactCount: contacts.length
    });
  }, [coords, isTracking, contacts.length]);

  const sendSOS = useCallback(async (reason = 'Manual SOS') => {
    const current = coords || (await refreshLocation());
    const primaryNumber = contacts[0]?.phone;
    const allNumbers = contacts.map((c) => c.phone);
    const message = buildSOSMessage(current, safety.label);

    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    await pushHistory({
      type: 'SOS',
      title: 'SOS triggered',
      detail: `Reason: ${reason}. Primary contact: ${primaryNumber || 'None'}`
    });

    if (!primaryNumber) {
      Alert.alert('No emergency contact', 'Add a trusted contact first.');
      return;
    }

    Alert.alert(
      'SOS started',
      'The app will open the dialer for the first contact and then open the SMS app with the danger message.',
      [{ text: 'OK' }]
    );

    await openCall(primaryNumber);
    setTimeout(() => {
      openSms(allNumbers, message).catch(() => {});
    }, 900);
  }, [contacts, coords, pushHistory, refreshLocation, safety.label]);

  useShakeSOS(settings.shakeEnabled, () => {
    sendSOS('Shake detection').catch(() => {});
  });

  return (
    <AppContext.Provider value={{
      contacts,
      settings,
      coords,
      loadingLocation,
      safety,
      history,
      locationHistory,
      isTracking,
      refreshLocation,
      startLiveTracking,
      stopLiveTracking,
      addContact,
      removeContact,
      updateSettings,
      sendSOS
    }}>
      {children}
    </AppContext.Provider>
  );
}
