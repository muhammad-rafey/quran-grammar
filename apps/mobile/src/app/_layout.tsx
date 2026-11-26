import { ActivityIndicator, Text, View, useColorScheme } from 'react-native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StudyProvider } from '@/state/study-provider';
import { PreferencesProvider, useInterface } from '@/state/preferences-provider';
import { paletteFor, useTheme } from '@/theme/theme';
import { startupFonts } from '@/theme/font-loading';

export const unstable_settings = { initialRouteName: 'index' };

export default function Layout() {
  // Only the default Quran and Urdu fonts block the first screen; a chosen font is loaded on
  // demand by PreferencesProvider (see theme/font-loading.ts).
  const [loaded, error] = useFonts(startupFonts);
  // Before the saved theme is read, the launch screen follows the device setting.
  const colors = paletteFor(useColorScheme() === 'dark' ? 'dark' : 'light');
  if (!loaded)
    return (
      <View
        style={{
          flex: 1,
          padding: 24,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
        }}
      >
        {error ? (
          <Text style={{ color: colors.ink }}>خط لوڈ نہیں ہو سکا۔ ایپ دوبارہ کھولیں۔</Text>
        ) : (
          <ActivityIndicator size="large" color={colors.primary} />
        )}
      </View>
    );
  return (
    <SafeAreaProvider>
      <PreferencesProvider>
        <StudyProvider>
          <AppStack />
        </StudyProvider>
      </PreferencesProvider>
    </SafeAreaProvider>
  );
}

function AppStack() {
  const { ui, isUrdu, activeFonts } = useInterface();
  const { colors, scheme } = useTheme();
  return (
    <>
      {/* Dark status bar icons on the light theme, light icons on the dark theme. */}
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.paper },
          headerTintColor: colors.primary,
          headerTitleStyle: {
            fontFamily: isUrdu ? activeFonts.urdu.family : undefined,
            fontSize: 20,
          },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
          headerBackButtonDisplayMode: 'minimal',
        }}
      >
        <Stack.Screen name="index" options={{ title: ui.study, headerShown: false }} />
        <Stack.Screen name="word/[id]" options={{ title: ui.wordStudy, presentation: 'modal' }} />
        <Stack.Screen name="topic/[id]" options={{ title: ui.grammarTopics }} />
        <Stack.Screen name="practice/[topicId]" options={{ title: ui.practiceGrammar }} />
      </Stack>
    </>
  );
}
