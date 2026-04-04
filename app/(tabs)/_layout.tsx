import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useLocale } from '@/context/AppContext';

function Dot() {
  return <View style={s.dot} />;
}

function LangToggle() {
  const { locale, setLocale } = useLocale();
  return (
    <View style={s.toggleWrap}>
      <TouchableOpacity
        style={[s.toggleBtn, locale === 'en' && s.toggleActive]}
        onPress={() => setLocale('en')}
        activeOpacity={0.8}
      >
        <Text style={[s.toggleText, locale === 'en' && s.toggleTextActive]}>EN</Text>
      </TouchableOpacity>
      <View style={s.toggleDivider} />
      <TouchableOpacity
        style={[s.toggleBtn, locale === 'es' && s.toggleActive]}
        onPress={() => setLocale('es')}
        activeOpacity={0.8}
      >
        <Text style={[s.toggleText, locale === 'es' && s.toggleTextActive]}>ES</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#0d1a1a',
            borderTopColor: '#1e3333',
            height: 60,
            paddingBottom: 8,
          },
          tabBarActiveTintColor: '#1db896',
          tabBarInactiveTintColor: '#5a8888',
          tabBarLabelStyle: { fontSize: 11 },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{ title: 'Home', tabBarIcon: ({ focused }) => focused ? <Dot /> : null }}
        />
        <Tabs.Screen
          name="learn"
          options={{ title: 'Learn', tabBarIcon: ({ focused }) => focused ? <Dot /> : null }}
        />
        <Tabs.Screen
          name="chat"
          options={{ title: 'AI', tabBarIcon: ({ focused }) => focused ? <Dot /> : null }}
        />
        <Tabs.Screen
          name="profile"
          options={{ title: 'Profile', tabBarIcon: ({ focused }) => focused ? <Dot /> : null }}
        />
        <Tabs.Screen name="dashboard" options={{ href: null }} />
      </Tabs>

      {/* Floating language toggle — sits above every tab */}
      <View style={s.floatWrap} pointerEvents="box-none">
        <LangToggle />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  dot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: '#1db896', marginBottom: 2,
  },
  floatWrap: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 38,
    right: 16,
    zIndex: 100,
  },
  toggleWrap: {
    flexDirection: 'row',
    backgroundColor: '#0d2020',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#1db89666',
    overflow: 'hidden',
  },
  toggleBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  toggleActive: {
    backgroundColor: '#1db896',
  },
  toggleDivider: {
    width: 1,
    backgroundColor: '#1db89666',
  },
  toggleText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#5a8888',
    letterSpacing: 1,
  },
  toggleTextActive: {
    color: '#fff',
  },
});
