import { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Platform, ActivityIndicator,
} from 'react-native';
import { useLocale } from '@/context/AppContext';

const FONT = Platform.OS === 'ios' ? 'Avenir Next' : undefined;
const FF = FONT ? { fontFamily: FONT } : {};

const GOAL_MAP: Record<string, string> = {
  'new-arrival': 'build_credit',
  'first-gen': 'save_money',
  'established': 'start_investing',
};

const CATEGORY_ICON: Record<string, string> = {
  credit_card: '💳',
  bank: '🏦',
  investing_app: '📈',
};

const T = {
  en: {
    eyebrow: '◆ FOR YOU ◆',
    title: 'Recommendations',
    subtitle: 'Curated for your goal',
    empty: 'No recommendations found for your profile.',
    loading: 'Loading...',
  },
  es: {
    eyebrow: '◆ PARA TI ◆',
    title: 'Recomendaciones',
    subtitle: 'Seleccionadas para tu meta',
    empty: 'No se encontraron recomendaciones para tu perfil.',
    loading: 'Cargando...',
  },
};

type RecItem = {
  id: number;
  name: string;
  provider?: string;
  description: string;
  category?: string;
  tags?: string;
  featured: boolean;
};

export default function RecommendationsScreen() {
  const { locale, lifeStage } = useLocale();
  const t = T[locale];

  const [items, setItems] = useState<RecItem[]>([]);
  const [loading, setLoading] = useState(true);

  const financial_goal = GOAL_MAP[lifeStage] ?? 'build_credit';
  const life_stage = lifeStage.replace('-', '_');

  useEffect(() => {
    fetch('http://localhost:8000/recommendations/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ financial_goal, life_stage, locale }),
    })
      .then((r) => r.json())
      .then((data) => setItems(data.items ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [financial_goal, life_stage, locale]);

  return (
    <View style={s.root}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        <View style={s.header}>
          <View style={s.iconBox}>
            <Text style={s.icon}>🎯</Text>
          </View>
          <View style={s.titleBlock}>
            <Text style={s.eyebrow}>{t.eyebrow}</Text>
            <Text style={s.pageTitle}>{t.title}</Text>
          </View>
        </View>

        <Text style={s.subtitle}>{t.subtitle}</Text>

        {loading ? (
          <ActivityIndicator color="#1db896" style={{ marginTop: 40 }} />
        ) : items.length === 0 ? (
          <Text style={s.empty}>{t.empty}</Text>
        ) : (
          items.map((item) => (
            <View key={item.id} style={[s.card, item.featured && s.cardFeatured]}>
              <View style={s.cardTop}>
                <Text style={s.cardIcon}>
                  {CATEGORY_ICON[item.category ?? ''] ?? '💡'}
                </Text>
                <View style={s.cardText}>
                  <Text style={s.cardName}>{item.name}</Text>
                  {item.provider ? (
                    <Text style={s.cardProvider}>{item.provider}</Text>
                  ) : null}
                </View>
                {item.featured ? (
                  <View style={s.featuredBadge}>
                    <Text style={s.featuredText}>★ TOP</Text>
                  </View>
                ) : null}
              </View>
              <Text style={s.cardDesc}>{item.description}</Text>
              {item.tags ? (
                <Text style={s.cardTags}>{item.tags}</Text>
              ) : null}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#08081A' },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 56 : 40,
    paddingBottom: 104,
    gap: 12,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
  iconBox: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: '#1A2800', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#1db89655',
  },
  icon: { fontSize: 26 },
  titleBlock: { flex: 1, gap: 2 },
  eyebrow: { fontSize: 10, color: '#1db896', fontWeight: '800', letterSpacing: 2, ...FF },
  pageTitle: { fontSize: 26, fontWeight: '800', color: '#fff', ...FF },
  subtitle: { fontSize: 13, color: '#9090B8', marginBottom: 4 },
  empty: { fontSize: 14, color: '#44446A', textAlign: 'center', marginTop: 40 },
  card: {
    backgroundColor: '#0F0F24', borderRadius: 20,
    padding: 16, gap: 10, borderWidth: 1.5, borderColor: '#1C1C38',
  },
  cardFeatured: { borderColor: '#1db89666' },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardIcon: { fontSize: 28 },
  cardText: { flex: 1 },
  cardName: { fontSize: 16, fontWeight: '700', color: '#fff', ...FF },
  cardProvider: { fontSize: 12, color: '#44446A', marginTop: 2 },
  featuredBadge: {
    backgroundColor: '#1db89622', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: '#1db896',
  },
  featuredText: { fontSize: 10, fontWeight: '800', color: '#1db896', letterSpacing: 1 },
  cardDesc: { fontSize: 13, color: '#9090B8', lineHeight: 18 },
  cardTags: { fontSize: 11, color: '#44446A', letterSpacing: 0.3 },
});
