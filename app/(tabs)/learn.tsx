import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Platform, Linking } from 'react-native';
import { useLocale, LifeStage } from '@/context/AppContext';

const FONT = Platform.OS === 'ios' ? 'Avenir Next' : undefined;
const FF = FONT ? { fontFamily: FONT } : {};

const C = {
  bg:     '#F0F5FC',
  card:   '#FFFFFF',
  border: '#D6E8F5',
  navy:   '#1B3B6F',
  blue:   '#3B73B9',
  gold:   '#C4991A',
  text:   '#0E1E3D',
  text2:  '#4B6080',
  text3:  '#8FA7C0',
  green:  '#1A7A56',
  tintN:  '#EBF0FA',
  tintG:  '#FDF7E6',
  tintB:  '#EBF4FF',
};

function LangToggle() {
  const { locale, setLocale } = useLocale();
  return (
    <View style={lt.wrap}>
      <TouchableOpacity style={[lt.btn, locale === 'en' && lt.active]} onPress={() => setLocale('en')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 4 }}>
        <Text style={[lt.text, locale === 'en' && lt.activeText]}>EN</Text>
      </TouchableOpacity>
      <View style={lt.divider} />
      <TouchableOpacity style={[lt.btn, locale === 'es' && lt.active]} onPress={() => setLocale('es')} hitSlop={{ top: 10, bottom: 10, left: 4, right: 10 }}>
        <Text style={[lt.text, locale === 'es' && lt.activeText]}>ES</Text>
      </TouchableOpacity>
    </View>
  );
}

const T = {
  en: {
    eyebrow: 'KNOWLEDGE BASE',
    title: 'Learn',
    xpLabel: 'YOUR PROGRESS',
    pts: 'pts',
    lessons: 'lessons',
    footer: 'Keep Learning',
    resourcesLabel: 'CURATED FOR YOU',
    resourcesTitle: 'Resources',
    resourcesSub: 'Personalized to your life stage',
    visitBtn: 'Visit →',
    watchBtn: 'Watch →',
    close: 'Close',
    start: 'Start Lesson',
    markDone: 'Mark Complete',
    statusDone: 'Complete',
    statusInProgress: 'In Progress',
    statusNotStarted: 'Not Started',
    sections: [
      {
        section: 'Credit Basics', emoji: '💳',
        items: [
          { id: '1', emoji: '📊', xp: 50, title: 'What is a credit score?', duration: undefined, body: "A credit score is a number from 300–850 that lenders use to judge how likely you are to repay debt. Higher is better. It's based on payment history, amounts owed, length of credit history, new credit, and credit mix." },
          { id: '2', emoji: '💳', xp: 50, title: 'How do credit cards work?', duration: 'Beginner', body: 'A credit card lets you borrow money up to a limit. You pay it back monthly. Paying on time builds credit. Carrying a balance costs interest (APR). Keep utilization below 30% for a healthy score.' },
        ],
      },
      {
        section: 'Saving & Investing', emoji: '📈',
        items: [
          { id: '3', emoji: '🚀', xp: 75, title: 'How to start investing', duration: '5 min', body: "Start with your employer's 401(k) if available — especially if there's a match. Then open a Roth IRA. Index funds are low-cost and diversified. Time in market beats timing the market." },
          { id: '4', emoji: '🏦', xp: 40, title: 'What is a savings account?', duration: '4 min', body: 'A savings account holds money at a bank and earns interest. High-yield savings accounts (HYSAs) offer 4–5% APY. Keep 3–6 months of expenses as an emergency fund in one.' },
        ],
      },
    ],
  },
  es: {
    eyebrow: 'BASE DE CONOCIMIENTO',
    title: 'Aprender',
    xpLabel: 'TU PROGRESO',
    pts: 'pts',
    lessons: 'lecciones',
    footer: 'Sigue Aprendiendo',
    resourcesLabel: 'PARA TI',
    resourcesTitle: 'Recursos',
    resourcesSub: 'Personalizados para tu etapa de vida',
    visitBtn: 'Visitar →',
    watchBtn: 'Ver →',
    close: 'Cerrar',
    start: 'Comenzar lección',
    markDone: 'Marcar como hecho',
    statusDone: 'Completado',
    statusInProgress: 'En progreso',
    statusNotStarted: 'Sin comenzar',
    sections: [
      {
        section: 'Bases del Crédito', emoji: '💳',
        items: [
          { id: '1', emoji: '📊', xp: 50, title: '¿Qué es un puntaje de crédito?', duration: undefined, body: 'Un puntaje de crédito es un número del 300 al 850 que los prestamistas usan para evaluar tu probabilidad de pagar una deuda. Se basa en historial de pagos, deudas actuales, antigüedad del crédito y tipos de crédito.' },
          { id: '2', emoji: '💳', xp: 50, title: '¿Cómo funcionan las tarjetas de crédito?', duration: 'Principiante', body: 'Una tarjeta de crédito te permite pedir prestado hasta un límite. Lo pagas mensualmente. Pagar a tiempo construye crédito. Mantener saldo genera intereses (APR). Mantén el uso por debajo del 30%.' },
        ],
      },
      {
        section: 'Ahorro e Inversión', emoji: '📈',
        items: [
          { id: '3', emoji: '🚀', xp: 75, title: '¿Cómo empezar a invertir?', duration: '5 min', body: 'Comienza con el 401(k) de tu empleador si está disponible. Luego abre una Roth IRA. Los fondos indexados son de bajo costo y diversificados. El tiempo en el mercado supera al momento de entrar.' },
          { id: '4', emoji: '🏦', xp: 40, title: '¿Qué es una cuenta de ahorros?', duration: '4 min', body: 'Una cuenta de ahorros guarda dinero en un banco y genera intereses. Las cuentas de alto rendimiento (HYSA) ofrecen 4–5% APY. Guarda 3–6 meses de gastos como fondo de emergencia.' },
        ],
      },
    ],
  },
};

type Resource = { id: string; emoji: string; title: string; desc: string; url: string; type: 'video' | 'site' | 'tool' };

const RESOURCES: Record<LifeStage, { en: Resource[]; es: Resource[] }> = {
  'new-arrival': {
    en: [
      { id: 'na-1', emoji: '🏛️', title: 'CFPB – Financial Tools', desc: 'Free guides on banking, credit, and your rights as a consumer in the U.S.', url: 'https://www.consumerfinance.gov/consumer-tools/', type: 'site' },
      { id: 'na-2', emoji: '▶️', title: 'MissBeHelpful (YouTube)', desc: 'Yanely Espinal explains money basics for first-gen and immigrant families.', url: 'https://www.youtube.com/@MissBeHelpful', type: 'video' },
      { id: 'na-3', emoji: '💸', title: 'Wise – Send Money Home', desc: 'Compare transfer rates and send money to Latin America with low fees.', url: 'https://wise.com', type: 'tool' },
      { id: 'na-4', emoji: '🔒', title: 'Self – Credit Builder', desc: 'Build U.S. credit with no existing history and no Social Security Number required.', url: 'https://www.self.inc', type: 'tool' },
    ],
    es: [
      { id: 'na-1', emoji: '🏛️', title: 'CFPB en Español', desc: 'Guías gratuitas sobre banca, crédito y tus derechos como consumidor en EE.UU.', url: 'https://www.consumerfinance.gov/es/', type: 'site' },
      { id: 'na-2', emoji: '▶️', title: 'Hábitos de Riqueza (YouTube)', desc: 'Educación financiera en español: crédito, ahorro y banca para la comunidad hispana.', url: 'https://www.youtube.com/@HabitosDeRiqueza', type: 'video' },
      { id: 'na-3', emoji: '💸', title: 'Wise – Envía Dinero', desc: 'Compara tasas y envía dinero a Latinoamérica con tarifas bajas y transparentes.', url: 'https://wise.com/es', type: 'tool' },
      { id: 'na-4', emoji: '🔒', title: 'Self – Construye Crédito', desc: 'Construye historial crediticio sin número de seguro social ni crédito previo.', url: 'https://www.self.inc', type: 'tool' },
    ],
  },
  'first-gen': {
    en: [
      { id: 'fg-1', emoji: '▶️', title: 'Hey Berna (YouTube)', desc: 'Berna Anat breaks down money in a fun, relatable way for first-gen Americans.', url: 'https://www.youtube.com/@heyberna', type: 'video' },
      { id: 'fg-2', emoji: '🎓', title: 'Khan Academy – Personal Finance', desc: 'Free lessons on budgeting, credit, taxes, and investing from scratch.', url: 'https://www.khanacademy.org/college-careers-more/personal-finance', type: 'site' },
      { id: 'fg-3', emoji: '📰', title: 'NerdWallet', desc: 'Expert guides on credit cards, Roth IRA, student loans, and more.', url: 'https://www.nerdwallet.com', type: 'site' },
      { id: 'fg-4', emoji: '🏦', title: 'Fidelity – Open a Roth IRA', desc: 'Start investing for retirement tax-free — even with a small amount.', url: 'https://www.fidelity.com/retirement-ira/roth-ira', type: 'tool' },
    ],
    es: [
      { id: 'fg-1', emoji: '▶️', title: 'Hábitos de Riqueza (YouTube)', desc: 'Inversión, crédito y planificación financiera para la primera generación en español.', url: 'https://www.youtube.com/@HabitosDeRiqueza', type: 'video' },
      { id: 'fg-2', emoji: '🎓', title: 'Khan Academy en Español', desc: 'Lecciones gratuitas de finanzas personales, crédito e inversión desde cero.', url: 'https://es.khanacademy.org/college-careers-more/personal-finance', type: 'site' },
      { id: 'fg-3', emoji: '📰', title: 'NerdWallet en Español', desc: 'Guías expertas sobre tarjetas de crédito, préstamos e inversiones en EE.UU.', url: 'https://www.nerdwallet.com/es-us', type: 'site' },
      { id: 'fg-4', emoji: '🏦', title: 'Fidelity – Roth IRA', desc: 'Invierte para el retiro libre de impuestos, incluso comenzando con poco dinero.', url: 'https://www.fidelity.com/retirement-ira/roth-ira', type: 'tool' },
    ],
  },
  'established': {
    en: [
      { id: 'es-1', emoji: '▶️', title: 'Andrei Jikh (YouTube)', desc: 'Dividend investing, index funds, and building generational wealth.', url: 'https://www.youtube.com/@AndreiJikh', type: 'video' },
      { id: 'es-2', emoji: '📊', title: 'Bogleheads', desc: "Low-cost index fund investing philosophy inspired by Vanguard's Jack Bogle.", url: 'https://www.bogleheads.org', type: 'site' },
      { id: 'es-3', emoji: '💼', title: 'Vanguard', desc: 'Low-cost index funds and ETFs for long-term wealth building and retirement.', url: 'https://investor.vanguard.com', type: 'tool' },
      { id: 'es-4', emoji: '📰', title: 'Investopedia', desc: 'Deep-dive articles on advanced investing, tax optimization, and estate planning.', url: 'https://www.investopedia.com', type: 'site' },
    ],
    es: [
      { id: 'es-1', emoji: '▶️', title: 'Inversión Simple (YouTube)', desc: 'Fondos indexados, dividendos y construcción de patrimonio en español.', url: 'https://www.youtube.com/@InversionSimple', type: 'video' },
      { id: 'es-2', emoji: '📊', title: 'Bogleheads', desc: 'Filosofía de inversión a largo plazo en fondos índice de bajo costo.', url: 'https://www.bogleheads.org', type: 'site' },
      { id: 'es-3', emoji: '💼', title: 'Vanguard', desc: 'Fondos de inversión de bajo costo para construir riqueza a largo plazo.', url: 'https://investor.vanguard.com', type: 'tool' },
      { id: 'es-4', emoji: '📰', title: 'Investopedia en Español', desc: 'Artículos sobre inversión avanzada, optimización fiscal y planificación patrimonial.', url: 'https://www.investopedia.com/espanol-4781689', type: 'site' },
    ],
  },
};

const TYPE_COLOR: Record<Resource['type'], string> = { video: '#C4991A', site: '#3B73B9', tool: '#1A7A56' };
const TYPE_BG: Record<Resource['type'], string> = { video: '#FDF7E6', site: '#EBF4FF', tool: '#E8F5EF' };

type Status = 'done' | 'in-progress' | 'not-started';

const STATUS_COLOR: Record<Status, string> = { done: '#1A7A56', 'in-progress': '#C4991A', 'not-started': '#8FA7C0' };
const STATUS_BG: Record<Status, string> = { done: '#E8F5EF', 'in-progress': '#FDF7E6', 'not-started': '#F0F5FC' };
const INITIAL: Record<string, Status> = { '1': 'done', '2': 'in-progress', '3': 'not-started', '4': 'not-started' };

function XpDots({ pct }: { pct: number }) {
  const total = 10;
  const filled = Math.round((pct / 100) * total);
  return (
    <View style={{ flexDirection: 'row', gap: 4 }}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={{ width: 14, height: 6, borderRadius: 3, backgroundColor: i < filled ? C.gold : C.border }} />
      ))}
    </View>
  );
}

export default function LearnScreen() {
  const { locale, lifeStage } = useLocale();
  const t = T[locale];
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<Record<string, Status>>(INITIAL);

  const allItems = t.sections.flatMap(sec => sec.items);
  const selected = selectedId ? allItems.find(i => i.id === selectedId) ?? null : null;

  function advance(id: string) {
    setStatuses(prev => {
      const cur = prev[id];
      return { ...prev, [id]: cur === 'not-started' ? 'in-progress' : 'done' };
    });
  }

  const doneCount = Object.values(statuses).filter(s => s === 'done').length;
  const total = allItems.length;
  const xpTotal = doneCount * 50;
  const statusLabel: Record<Status, string> = { done: t.statusDone, 'in-progress': t.statusInProgress, 'not-started': t.statusNotStarted };

  return (
    <View style={s.root}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        <View style={s.header}>
          <View>
            <Text style={s.eyebrow}>{t.eyebrow}</Text>
            <Text style={s.pageTitle}>{t.title}</Text>
          </View>
          <LangToggle />
        </View>

        {/* XP Card */}
        <View style={s.xpCard}>
          <View>
            <Text style={s.xpLabel}>{t.xpLabel}</Text>
            <Text style={s.xpNum}>{xpTotal} <Text style={s.xpUnit}>{t.pts}</Text></Text>
            <Text style={s.xpSub}>{doneCount}/{total} {t.lessons}</Text>
          </View>
          <View style={{ alignItems: 'flex-end', gap: 8 }}>
            <XpDots pct={(doneCount / total) * 100} />
            <View style={s.levelBadge}>
              <Text style={s.levelText}>LVL {Math.floor(doneCount / 2) + 1}</Text>
            </View>
          </View>
        </View>

        {t.sections.map(section => (
          <View key={section.section}>
            <View style={s.sectionHeader}>
              <Text style={s.sectionEmoji}>{section.emoji}</Text>
              <Text style={s.sectionLabel}>{section.section}</Text>
              <View style={s.sectionLine} />
            </View>
            {section.items.map(lesson => {
              const status = statuses[lesson.id];
              const fillPct = status === 'done' ? 100 : status === 'in-progress' ? 50 : 0;
              return (
                <TouchableOpacity
                  key={lesson.id}
                  style={[s.lessonCard, { backgroundColor: STATUS_BG[status], borderLeftColor: STATUS_COLOR[status] }]}
                  onPress={() => setSelectedId(lesson.id)}
                  activeOpacity={0.75}
                >
                  <View style={[s.lessonIcon, { backgroundColor: STATUS_COLOR[status] + '22' }]}>
                    <Text style={{ fontSize: 22 }}>{lesson.emoji}</Text>
                  </View>
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={s.lessonTitle}>{lesson.title}</Text>
                    <Text style={[s.statusText, { color: STATUS_COLOR[status] }]}>
                      {statusLabel[status]}{status === 'done' ? `  ·  ${lesson.xp} xp` : ''}{status !== 'done' && lesson.duration ? `  ·  ${lesson.duration}` : ''}
                    </Text>
                    <View style={s.barTrack}>
                      <View style={[s.barFill, { width: `${fillPct}%`, backgroundColor: STATUS_COLOR[status] }]} />
                    </View>
                  </View>
                  <Text style={s.chevron}>›</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        <View style={s.footerBadge}>
          <Text style={s.footerText}>{t.footer}</Text>
        </View>

        {/* Curated Resources */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionEmoji}>🔗</Text>
          <Text style={s.sectionLabel}>{t.resourcesLabel}</Text>
          <View style={s.sectionLine} />
        </View>
        <View style={s.resourcesCard}>
          <Text style={s.resourcesTitle}>{t.resourcesTitle}</Text>
          <Text style={s.resourcesSub}>{t.resourcesSub}</Text>
          {RESOURCES[lifeStage][locale].map((res, i) => (
            <TouchableOpacity
              key={res.id}
              style={[s.resourceRow, i < RESOURCES[lifeStage][locale].length - 1 && s.resourceBorder]}
              onPress={() => Linking.openURL(res.url)}
              activeOpacity={0.7}
            >
              <View style={[s.resourceIconBox, { backgroundColor: TYPE_BG[res.type] }]}>
                <Text style={{ fontSize: 20 }}>{res.emoji}</Text>
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <Text style={s.resourceTitle}>{res.title}</Text>
                  <View style={[s.typeBadge, { backgroundColor: TYPE_BG[res.type] }]}>
                    <Text style={[s.typeText, { color: TYPE_COLOR[res.type] }]}>{res.type.toUpperCase()}</Text>
                  </View>
                </View>
                <Text style={s.resourceDesc}>{res.desc}</Text>
              </View>
              <Text style={[s.resourceBtn, { color: TYPE_COLOR[res.type] }]}>
                {res.type === 'video' ? t.watchBtn : t.visitBtn}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal visible={!!selected} transparent animationType="slide" onRequestClose={() => setSelectedId(null)}>
        <View style={s.overlay}>
          <View style={s.modalCard}>
            {selected && (
              <>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Text style={{ fontSize: 30 }}>{selected.emoji}</Text>
                  <Text style={[s.lessonTitle, { flex: 1, fontSize: 17 }]}>{selected.title}</Text>
                </View>
                <View style={s.xpBadge}>
                  <Text style={s.xpBadgeText}>+{selected.xp} XP</Text>
                </View>
                <Text style={s.modalBody}>{selected.body}</Text>
                <View style={{ flexDirection: 'row', gap: 12, marginTop: 4 }}>
                  <TouchableOpacity style={s.cancelBtn} onPress={() => setSelectedId(null)}>
                    <Text style={s.cancelText}>{t.close}</Text>
                  </TouchableOpacity>
                  {statuses[selected.id] !== 'done' && (
                    <TouchableOpacity style={s.primaryBtn} onPress={() => { advance(selected.id); setSelectedId(null); }}>
                      <Text style={s.primaryText}>{statuses[selected.id] === 'not-started' ? t.start : t.markDone}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const lt = StyleSheet.create({
  wrap: { flexDirection: 'row', backgroundColor: C.tintN, borderRadius: 20, borderWidth: 1, borderColor: C.border, overflow: 'hidden' },
  btn: { paddingHorizontal: 12, paddingVertical: 6 },
  active: { backgroundColor: C.navy },
  divider: { width: 1, backgroundColor: C.border },
  text: { fontSize: 11, fontWeight: '700', color: C.text3, letterSpacing: 0.8, ...FF },
  activeText: { color: '#fff' },
});

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 56 : 40, paddingBottom: 104, gap: 14 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 4 },
  eyebrow: { fontSize: 10, color: C.blue, fontWeight: '700', letterSpacing: 2, ...FF },
  pageTitle: { fontSize: 28, fontWeight: '800', color: C.text, marginTop: 2, ...FF },
  xpCard: { backgroundColor: C.card, borderRadius: 18, padding: 18, borderWidth: 1, borderColor: C.border, borderTopWidth: 3, borderTopColor: C.gold, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', ...Platform.select({ ios: { shadowColor: C.navy, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 10 }, android: { elevation: 2 } }) },
  xpLabel: { fontSize: 10, color: C.blue, fontWeight: '700', letterSpacing: 1.5, ...FF },
  xpNum: { fontSize: 36, fontWeight: '800', color: C.gold, ...FF },
  xpUnit: { fontSize: 16, color: C.text2, fontWeight: '400' },
  xpSub: { fontSize: 12, color: C.text3, marginTop: 2 },
  levelBadge: { backgroundColor: C.navy, borderRadius: 50, paddingHorizontal: 14, paddingVertical: 4 },
  levelText: { color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 1, ...FF },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8, marginBottom: 10 },
  sectionEmoji: { fontSize: 15 },
  sectionLabel: { fontSize: 12, color: C.text2, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', ...FF },
  sectionLine: { flex: 1, height: 1, backgroundColor: C.border },
  lessonCard: { borderRadius: 16, padding: 14, borderWidth: 1, borderColor: C.border, borderLeftWidth: 4, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10, ...Platform.select({ ios: { shadowColor: C.navy, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6 }, android: { elevation: 1 } }) },
  lessonIcon: { width: 46, height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  lessonTitle: { fontSize: 14, fontWeight: '700', color: C.text, ...FF },
  statusText: { fontSize: 11, fontWeight: '600' },
  barTrack: { width: '100%', height: 4, backgroundColor: C.border, borderRadius: 4, overflow: 'hidden', marginTop: 2 },
  barFill: { height: '100%', borderRadius: 4 },
  chevron: { fontSize: 22, color: C.text3, fontWeight: '300' },
  footerBadge: { alignSelf: 'center', borderWidth: 1.5, borderColor: C.gold, borderRadius: 50, paddingHorizontal: 22, paddingVertical: 9, marginTop: 4 },
  footerText: { color: C.gold, fontSize: 12, fontWeight: '800', letterSpacing: 2, ...FF },
  overlay: { flex: 1, backgroundColor: '#0E1E3D99', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: C.card, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, gap: 14, borderTopWidth: 3, borderColor: C.gold },
  xpBadge: { alignSelf: 'flex-start', backgroundColor: C.tintG, borderRadius: 50, paddingHorizontal: 14, paddingVertical: 5, borderWidth: 1, borderColor: C.gold + '66' },
  xpBadgeText: { color: C.gold, fontSize: 13, fontWeight: '800', ...FF },
  modalBody: { fontSize: 14, color: C.text2, lineHeight: 22 },
  cancelBtn: { flex: 1, backgroundColor: C.bg, borderRadius: 50, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: C.border },
  cancelText: { color: C.text2, fontSize: 14, fontWeight: '700', ...FF },
  primaryBtn: { flex: 1, backgroundColor: C.navy, borderRadius: 50, paddingVertical: 14, alignItems: 'center' },
  primaryText: { color: '#fff', fontSize: 14, fontWeight: '700', ...FF },
  resourcesCard: { backgroundColor: C.card, borderRadius: 18, borderWidth: 1, borderColor: C.border, overflow: 'hidden', paddingHorizontal: 18, paddingTop: 14, paddingBottom: 4, ...Platform.select({ ios: { shadowColor: C.navy, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 10 }, android: { elevation: 2 } }) },
  resourcesTitle: { fontSize: 17, fontWeight: '800', color: C.text, ...FF },
  resourcesSub: { fontSize: 11, color: C.text3, marginTop: 2, marginBottom: 12 },
  resourceRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  resourceBorder: { borderBottomWidth: 1, borderBottomColor: C.border },
  resourceIconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  resourceTitle: { fontSize: 13, fontWeight: '700', color: C.text, flexShrink: 1, ...FF },
  typeBadge: { borderRadius: 50, paddingHorizontal: 8, paddingVertical: 2 },
  typeText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.8 },
  resourceDesc: { fontSize: 11, color: C.text3, lineHeight: 16 },
  resourceBtn: { fontSize: 12, fontWeight: '700', flexShrink: 0, ...FF },
});
