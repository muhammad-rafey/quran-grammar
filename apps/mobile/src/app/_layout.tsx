import { ActivityIndicator, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StudyProvider } from '@/state/study-provider';
import { PreferencesProvider, useInterface } from '@/state/preferences-provider';
import { colors } from '@/theme/tokens';

export const unstable_settings = { initialRouteName: 'index' };

export default function Layout() {
  const [loaded, error] = useFonts({
    AmiriQuran: require('../../assets/fonts/amiri-quran.ttf'),
    Naskh: require('../../assets/fonts/naskh.ttf'),
    Nastaliq: require('../../assets/fonts/nastaliq.ttf'),
  });
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
          <Text>خط لوڈ نہیں ہو سکا۔ ایپ دوبارہ کھولیں۔</Text>
        ) : (
          <ActivityIndicator size="large" color={colors.primary} />
        )}
      </View>
    );
  return (
    <SafeAreaProvider>
      <PreferencesProvider>
        <StudyProvider>
          <StatusBar style="dark" />
          <AppStack />
        </StudyProvider>
      </PreferencesProvider>
    </SafeAreaProvider>
  );
}

function AppStack() {
  const { ui, isUrdu } = useInterface();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.paper },
        headerTintColor: colors.primary,
        headerTitleStyle: { fontFamily: isUrdu ? 'Naskh' : undefined, fontSize: 20 },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen name="index" options={{ title: ui.surahTitle }} />
      <Stack.Screen name="word/[id]" options={{ title: ui.wordStudy, presentation: 'modal' }} />
    </Stack>
  );
}
