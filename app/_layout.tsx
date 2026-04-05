import { Stack } from 'expo-router';
import { AppProvider } from '@/context/AppContext';

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack screenOptions={{ contentStyle: { backgroundColor: '#EEF3FB' }, animation: 'fade', animationDuration: 350 }}>
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="modal" options={{ title: 'Modal', animation: 'slide_from_bottom' }} />
      </Stack>
    </AppProvider>
  );
}
