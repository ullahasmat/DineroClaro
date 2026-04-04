import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Linking, Platform,
} from 'react-native';
import { useLocale } from '@/context/AppContext';

const T = {
  en: {
    eyebrow: '◆ CURATED FOR YOU ◆',
    title: 'Recommended',
    goalPre: 'YOUR GOAL  ▶',
    goalValue: 'build credit',
    tipTitle: 'How we pick these',
    tipBody: 'Recommendations update as your credit score and finances improve. Keep your data fresh for the best suggestions.',
    stampLine1: 'LANA AI',
    stampLine2: '★ APPROVED ★',
    recs: [
      {
        id: '1', emoji: '💳', accentColor: '#FF6B6B',
        title: 'Discover it Secured',
        description: 'No annual fee · 2% cashback · reports to all 3 bureaus',
        tags: [
          { label: 'No credit needed', color: '#1a3a2a', textColor: '#1db896' },
          { label: '$200 min deposit', color: '#1a3333', textColor: '#8ab8b8' },
        ],
      },
      {
        id: '2', emoji: '🏦', accentColor: '#FFE566',
        title: 'Chase Total Checking',
        description: '$0 fee with direct deposit · large ATM network · easy app',
        tags: [
          { label: 'Beginner-friendly', color: '#1a2a00', textColor: '#FFE566' },
        ],
      },
      {
        id: '3', emoji: '📈', accentColor: '#7C5CBF',
        title: 'Fidelity — start investing',
        description: '$0 min · fractional shares · no account fees',
        tags: [
          { label: 'After credit is built', color: '#2a1a3a', textColor: '#7C5CBF' },
        ],
      },
    ],
  },
  es: {
    eyebrow: '◆ SELECCIONADO PARA TI ◆',
    title: 'Recomendados',
    goalPre: 'TU META  ▶',
    goalValue: 'construir crédito',
    tipTitle: 'Cómo elegimos estas opciones',
    tipBody: 'Las recomendaciones se actualizan a medida que mejora tu puntaje de crédito. Mantén tus datos al día para obtener las mejores sugerencias.',
    stampLine1: 'LANA IA',
    stampLine2: '★ APROBADO ★',
    recs: [
      {
        id: '1', emoji: '💳', accentColor: '#FF6B6B',
        title: 'Discover it Secured',
        description: 'Sin cuota anual · 2% cashback · reporta a las 3 agencias',
        tags: [
          { label: 'Sin crédito requerido', color: '#1a3a2a', textColor: '#1db896' },
          { label: 'Depósito mín. $200', color: '#1a3333', textColor: '#8ab8b8' },
        ],
      },
      {
        id: '2', emoji: '🏦', accentColor: '#FFE566',
        title: 'Chase Total Checking',
        description: '$0 con depósito directo · amplia red de ATMs · app sencilla',
        tags: [
          { label: 'Amigable para principiantes', color: '#1a2a00', textColor: '#FFE566' },
        ],
      },
      {
        id: '3', emoji: '📈', accentColor: '#7C5CBF',
        title: 'Fidelity — empieza a invertir',
        description: '$0 mínimo · acciones fraccionadas · sin comisiones',
        tags: [
          { label: 'Después de construir crédito', color: '#2a1a3a', textColor: '#7C5CBF' },
        ],
      },
    ],
  },
};

function ZigZag({ color }: { color: string }) {
  return (
    <View style={z.row}>
      {Array.from({ length: 16 }).map((_, i) => (
        <View
          key={i}
          style={[z.triangle, {
            borderBottomColor: color, borderBottomWidth: i % 2 === 0 ? 8 : 0,
            borderTopColor: color, borderTopWidth: i % 2 !== 0 ? 8 : 0,
            borderLeftWidth: 6, borderRightWidth: 6,
            borderLeftColor: 'transparent', borderRightColor: 'transparent',
          }]}
        />
      ))}
    </View>
  );
}

export default function ProfileScreen() {
  const { locale } = useLocale();
  const t = T[locale];

  return (
    <View style={s.root}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.retroHeader}>
          <View style={s.retroIconBox}>
            <Text style={s.retroIcon}>⭐</Text>
          </View>
          <View>
            <Text style={s.retroEyebrow}>{t.eyebrow}</Text>
            <Text style={s.pageTitle}>{t.title}</Text>
          </View>
        </View>

        <View style={s.goalBanner}>
          <ZigZag color="#1db896" />
          <View style={s.goalInner}>
            <Text style={s.goalPre}>{t.goalPre}</Text>
            <Text style={s.goalValue}>{t.goalValue}</Text>
          </View>
          <ZigZag color="#1db896" />
        </View>

        {t.recs.map((rec) => (
          <TouchableOpacity
            key={rec.id}
            style={[s.recCard, { borderLeftColor: rec.accentColor }]}
            onPress={() => Linking.openURL('https://www.google.com/search?q=' + encodeURIComponent(rec.title))}
            activeOpacity={0.75}
          >
            <View style={s.recTopRow}>
              <View style={[s.recIconBox, { backgroundColor: rec.accentColor + '22' }]}>
                <Text style={s.recEmoji}>{rec.emoji}</Text>
              </View>
              <View style={s.recTextBlock}>
                <Text style={s.recTitle}>{rec.title}</Text>
                <Text style={s.recDesc}>{rec.description}</Text>
              </View>
              <Text style={[s.recArrow, { color: rec.accentColor }]}>›</Text>
            </View>
            <View style={s.tagRow}>
              {rec.tags.map((tag) => (
                <View key={tag.label} style={[s.tag, { backgroundColor: tag.color, borderColor: (tag.textColor ?? '#8ab8b8') + '55' }]}>
                  <Text style={[s.tagText, { color: tag.textColor ?? '#8ab8b8' }]}>{tag.label}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}

        <View style={s.tip}>
          <Text style={s.tipIcon}>🔮</Text>
          <View style={s.tipText}>
            <Text style={s.tipTitle}>{t.tipTitle}</Text>
            <Text style={s.tipBody}>{t.tipBody}</Text>
          </View>
        </View>

        <View style={s.footerStamp}>
          <View style={s.stampInner}>
            <Text style={s.stampLine1}>{t.stampLine1}</Text>
            <Text style={s.stampLine2}>{t.stampLine2}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const z = StyleSheet.create({
  row: { flexDirection: 'row', overflow: 'hidden' },
  triangle: { width: 0, height: 0 },
});

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0d1a1a' },
  scroll: { paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 56 : 40, paddingBottom: 32, gap: 14 },
  retroHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
  retroIconBox: { width: 52, height: 52, borderRadius: 10, backgroundColor: '#FF6B6B', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#cc4444' },
  retroIcon: { fontSize: 26 },
  retroEyebrow: { fontSize: 10, color: '#FF6B6B', fontWeight: '800', letterSpacing: 2 },
  pageTitle: { fontSize: 26, fontWeight: '800', color: '#fff' },
  goalBanner: { backgroundColor: '#0d2a22', borderRadius: 12, overflow: 'hidden', borderWidth: 2, borderColor: '#1db89644' },
  goalInner: { paddingVertical: 12, paddingHorizontal: 16, gap: 2 },
  goalPre: { fontSize: 10, color: '#1db896', fontWeight: '800', letterSpacing: 2 },
  goalValue: { fontSize: 20, fontWeight: '800', color: '#fff' },
  recCard: { backgroundColor: '#1a2a2a', borderRadius: 12, padding: 16, gap: 10, borderWidth: 2, borderColor: '#1e3d3d', borderLeftWidth: 4 },
  recTopRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  recIconBox: { width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  recEmoji: { fontSize: 22 },
  recTextBlock: { flex: 1, gap: 2 },
  recTitle: { fontSize: 16, fontWeight: '800', color: '#fff' },
  recDesc: { fontSize: 12, color: '#8ab8b8', lineHeight: 17 },
  recArrow: { fontSize: 24, fontWeight: '300' },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1 },
  tagText: { fontSize: 12, fontWeight: '600' },
  tip: { backgroundColor: '#061212', borderRadius: 12, padding: 14, borderWidth: 2, borderColor: '#1db89630', flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  tipIcon: { fontSize: 24 },
  tipText: { flex: 1, gap: 3 },
  tipTitle: { fontSize: 14, fontWeight: '800', color: '#1db896' },
  tipBody: { fontSize: 13, color: '#8ab8b8', lineHeight: 18 },
  footerStamp: { alignSelf: 'center', marginTop: 4 },
  stampInner: { borderWidth: 3, borderColor: '#FF6B6B', borderRadius: 8, paddingHorizontal: 20, paddingVertical: 10, alignItems: 'center', transform: [{ rotate: '-2deg' }] },
  stampLine1: { fontSize: 11, color: '#FF6B6B', fontWeight: '800', letterSpacing: 3 },
  stampLine2: { fontSize: 14, color: '#FF6B6B', fontWeight: '800', letterSpacing: 2 },
});
