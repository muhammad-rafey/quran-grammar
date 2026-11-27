import { useCallback } from 'react';
import { BackHandler } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { stackBackTarget } from './back-navigation';

/**
 * Runs `onBack` for the Android back button and back gesture while this screen is focused (null:
 * leave it to the navigator/system). The listener is removed when the screen loses focus, so a word
 * screen opened on top closes itself first. iOS has no hardware back; its edge swipe pops the native
 * stack, which is what `onBack` does on a pushed screen.
 */
export function useHardwareBack(onBack: (() => void) | null) {
  useFocusEffect(
    useCallback(() => {
      if (!onBack) return;
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        onBack();
        return true;
      });
      return () => subscription.remove();
    }, [onBack]),
  );
}

/**
 * Back for a pushed screen of the practice flow (topic, quiz): the function the on-screen Back
 * button calls, also bound to the Android back button so both do exactly the same.
 */
export function useStackBack(): () => void {
  const router = useRouter();
  const goBack = useCallback(() => {
    if (stackBackTarget(router.canGoBack()) === 'pop') router.back();
    else router.replace('/');
  }, [router]);
  useHardwareBack(goBack);
  return goBack;
}
