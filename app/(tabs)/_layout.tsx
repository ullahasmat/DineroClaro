import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useLocale } from '@/context/AppContext';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const FONT = Platform.OS === 'ios' ? 'Avenir Next' : undefined;

const TAB_LABELS = {
  en: { index: 'Home', learn: 'Learn', chat: 'Lana', vault: 'Vault', profile: 'Profile' },
  es: { index: 'Inicio', learn: 'Aprender', chat: 'Lana', vault: 'Bóveda', profile: 'Perfil' },
};

function GlassTabBar({ state, navigation }: BottomTabBarProps) {
  const { locale } = useLocale();
  const labels = TAB_LABELS[locale];

  return (
    <View style={s.barOuter}>
      <BlurView intensity={60} tint="dark" style={s.blur}>
        <View style={s.barInner}>
          {state.routes
            .filter(route => ['index', 'learn', 'chat', 'vault', 'profile'].includes(route.name))
            .map((route) => {
              const focused = state.index === state.routes.indexOf(route);
              const label = labels[route.name as keyof typeof labels] ?? route.name;

              return (
                <TouchableOpacity
                  key={route.key}
                  style={s.tab}
                  onPress={() => {
                    const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                    if (!focused && !event.defaultPrevented) {
                      navigation.navigate(route.name);
                    }
                  }}
                  activeOpacity={0.7}
                >
                  {focused && <View style={s.dot} />}
                  <Text style={[s.label, focused ? s.labelActive : s.labelInactive]}>{label}</Text>
                </TouchableOpacity>
              );
            })}
        </View>
      </BlurView>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <GlassTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        lazy: false,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="learn" />
      <Tabs.Screen name="chat" />
      <Tabs.Screen name="vault" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const s = StyleSheet.create({
  barOuter: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 28,
    overflow: 'hidden',
    ...(Platform.OS === 'ios'
      ? { shadowColor: '#1B3B6F', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 24 }
      : { elevation: 16 }),
  },
  blur: {
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: 'rgba(15,35,75,0.15)',
  },
  barInner: {
    flexDirection: 'row',
    height: 68,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(15,35,75,0.42)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 28,
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: '100%',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E8B515',
    ...(Platform.OS === 'ios'
      ? { shadowColor: '#C4991A', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.9, shadowRadius: 4 }
      : { elevation: 4 }),
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
    textAlign: 'center',
    ...(FONT ? { fontFamily: FONT } : {}),
  },
  labelActive: {
    color: '#E8B515',
  },
  labelInactive: {
    color: 'rgba(200,215,240,0.75)',
  },
});
