import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { useLocale } from '@/context/AppContext';

function Dot() {
  return <View style={s.dot} />;
}

const TAB_LABELS = {
  en: { home: 'Home', learn: 'Learn', ai: 'Lana', profile: 'Profile' },
  es: { home: 'Inicio', learn: 'Aprender', ai: 'Lana', profile: 'Perfil' },
};

export default function TabLayout() {
  const { locale } = useLocale();
  const labels = TAB_LABELS[locale];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          backgroundColor: '#1B3B6F',
          borderTopWidth: 0,
          borderRadius: 28,
          height: 64,
          paddingBottom: 10,
          paddingTop: 4,
          elevation: 16,
          shadowColor: '#1B3B6F',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.25,
          shadowRadius: 20,
          borderWidth: 0,
        },
        tabBarActiveTintColor: '#C4991A',
        tabBarInactiveTintColor: '#7A9CC4',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          letterSpacing: 0.3,
          ...(Platform.OS === 'ios' ? { fontFamily: 'Avenir Next' } : {}),
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: labels.home, tabBarIcon: ({ focused }) => focused ? <Dot /> : null }}
      />
      <Tabs.Screen
        name="learn"
        options={{ title: labels.learn, tabBarIcon: ({ focused }) => focused ? <Dot /> : null }}
      />
      <Tabs.Screen
        name="chat"
        options={{ title: labels.ai, tabBarIcon: ({ focused }) => focused ? <Dot /> : null }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: labels.profile, tabBarIcon: ({ focused }) => focused ? <Dot /> : null }}
      />
      <Tabs.Screen name="dashboard" options={{ href: null }} />
      <Tabs.Screen name="recommendations" options={{ href: null }} />
    </Tabs>
  );
}

const s = StyleSheet.create({
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#C4991A',
    ...(Platform.OS === 'ios' ? {
      shadowColor: '#C4991A',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.9,
      shadowRadius: 4,
    } : { elevation: 4 }),
  },
});
