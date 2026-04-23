import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { Accelerometer } from 'expo-sensors';

export default function useShakeSOS(enabled, onShake) {
  const lastTrigger = useRef(0);

  useEffect(() => {
    if (!enabled || Platform.OS === 'web') return;
    Accelerometer.setUpdateInterval(420);
    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      const magnitude = Math.abs(x) + Math.abs(y) + Math.abs(z);
      const now = Date.now();
      if (magnitude > 2.45 && now - lastTrigger.current > 7000) {
        lastTrigger.current = now;
        onShake?.();
      }
    });
    return () => subscription?.remove();
  }, [enabled, onShake]);
}
