import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Modal, Platform,
} from 'react-native';
import { useLocale } from '@/context/AppContext';

const FONT = Platform.OS === 'ios' ? 'Avenir Next' : undefined;

function LangToggle() {
  const { locale, setLocale } = useLocale();
  return (
    <View style={lt.wrap}>
      <TouchableOpacity
        style={[lt.btn, locale === 'en' && lt.active]}
        onPress={() => setLocale('en')}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 4 }}
      >
        <Text style={[lt.text, locale === 'en' && lt.activeText]}>EN</Text>
      </TouchableOpacity>
      <View style={lt.divider} />
      <TouchableOpacity
        style={[lt.btn, locale === 'es' && lt.active]}
        onPress={() => setLocale('es')}
        hitSlop={{ top: 10, bottom: 10, left: 4, right: 10 }}
      >
        <Text style={[lt.text, locale === 'es' && lt.activeText]}>ES</Text>
      </TouchableOpacity>
    </View>
  );
}

const T = {
  en: {
    eyebrow: '◆ KNOWLEDGE BASE ◆',
    title: 'Learn',
    xpLabel: 'PLAYER XP',
    pts: 'pts',
    lessons: 'lessons',
    footer: '★  KEEP LEARNING  ★',
    close: '✕ Close',
    start: '▶ Start',
    markDone: '✓ Mark done',
    statusDone: '✓ Done',
    statusInProgress: '▶ In progress',
    statusNotStarted: '○ Not started',
    sections: [
      {
        section: 'Credit basics', emoji: '💳',
        items: [
          {
            id: '1', emoji: '📊', xp: 50,
            title: 'What is a credit score?',
            duration: undefined,
            body: "A credit score is a number from 300–850 that lenders use to judge how likely you are to repay debt. Higher is better. It's based on payment history, amounts owed, length of credit history, new credit, and credit mix.",
          },
          {
            id: '2', emoji: '💳', xp: 50,
            title: 'How do credit cards work?',
            duration: 'beginner',
            body: 'A credit card lets you borrow money up to a limit. You pay it back monthly. Paying on time builds credit. Carrying a balance costs interest (APR). Keep utilization below 30% for a healthy score.',
          },
        ],
      },
      {
        section: 'Saving & investing', emoji: '📈',
        items: [
          {
            id: '3', emoji: '🚀', xp: 75,
            title: 'How to start investing',
            duration: '5 min',
            body: "Start with your employer's 401(k) if available — especially if there's a match. Then open a Roth IRA. Index funds are low-cost and diversified. Time in market beats timing the market.",
          },
          {
            id: '4', emoji: '🏦', xp: 40,
            title: 'What is a savings account?',
            duration: '4 min',
            body: 'A savings account holds money at a bank and earns interest. High-yield savings accounts (HYSAs) offer 4–5% APY. Keep 3–6 months of expenses as an emergency fund in one.',
          },
        ],
      },
    ],
  },
  es: {
    eyebrow: '◆ BASE DE CONOCIMIENTO ◆',
    title: 'Aprender',
    xpLabel: 'XP DEL JUGADOR',
    pts: 'pts',
    lessons: 'lecciones',
    footer: '★  SIGUE APRENDIENDO  ★',
    close: '✕ Cerrar',
    start: '▶ Comenzar',
    markDone: '✓ Marcar como hecho',
    statusDone: '✓ Hecho',
    statusInProgress: '▶ En progreso',
    statusNotStarted: '○ Sin comenzar',
    sections: [
      {
        section: 'Bases del crédito', emoji: '💳',
        items: [
          {
            id: '1', emoji: '📊', xp: 50,
            title: '¿Qué es un puntaje de crédito?',
            duration: undefined,
            body: 'Un puntaje de crédito es un número del 300 al 850 que los prestamistas usan para evaluar tu probabilidad de pagar una deuda. Se basa en historial de pagos, deudas actuales, antigüedad del crédito y tipos de crédito.',
          },
          {
            id: '2', emoji: '💳', xp: 50,
            title: '¿Cómo funcionan las tarjetas de crédito?',
            duration: 'principiante',
            body: 'Una tarjeta de crédito te permite pedir prestado hasta un límite. Lo pagas mensualmente. Pagar a tiempo construye crédito. Mantener saldo genera intereses (APR). Mantén el uso por debajo del 30%.',
          },
        ],
      },
      {
        section: 'Ahorro e inversión', emoji: '📈',
        items: [
          {
            id: '3', emoji: '🚀', xp: 75,
            title: '¿Cómo empezar a invertir?',
            duration: '5 min',
            body: 'Comienza con el 401(k) de tu empleador si está disponible. Luego abre una Roth IRA. Los fondos indexados son de bajo costo y diversificados. El tiempo en el mercado supera al momento de entrar.',
          },
          {
            id: '4', emoji: '🏦', xp: 40,
            title: '¿Qué es una cuenta de ahorros?',
            duration: '4 min',
            body: 'Una cuenta de ahorros guarda dinero en un banco y genera intereses. Las cuentas de alto rendimiento (HYSA) ofrecen 4–5% APY. Guarda 3–6 meses de gastos como fondo de emergencia.',
          },
        ],
      },
    ],
  },
};

type Status = 'done' | 'in-progress' | 'not-started';

const STATUS_COLOR: Record<Status, string> = {
  done: '#00E5A8',
  'in-progress': '#FFD060',
  'not-started': '#2A2A48',
};
const STATUS_BG: Record<Status, string> = {
  done: '#06201A',
  'in-progress': '#1E1A00',
  'not-started': '#0F0F24',
};

const INITIAL_STATUSES: Record<string, Status> = {
  '1': 'done', '2': 'in-progress', '3': 'not-started', '4': 'not-started',
};

function XpBlocks({ pct }: { pct: number }) {
  const total = 10;
  const filled = Math.round((pct / 100) * total);
  return (
    <View style={xp.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={[xp.block, { backgroundColor: i < filled ? '#00E5A8' : '#1C1C38' }]} />
      ))}
    </View>
  );
}

export default function LearnScreen() {
  const { locale } = useLocale();
  const t = T[locale];

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<Record<string, Status>>(INITIAL_STATUSES);

  const allItems = t.sections.flatMap((sec) => sec.items);
  const selected = selectedId ? allItems.find((i) => i.id === selectedId) ?? null : null;

  function advance(id: string) {
    setStatuses((prev) => {
      const cur = prev[id];
      const next: Status = cur === 'not-started' ? 'in-progress' : 'done';
      return { ...prev, [id]: next };
    });
  }

  const doneCount = Object.values(statuses).filter((st) => st === 'done').length;
  const total = allItems.length;
  const xpTotal = doneCount * 50;

  const statusLabel: Record<Status, string> = {
    done: t.statusDone,
    'in-progress': t.statusInProgress,
    'not-started': t.statusNotStarted,
  };

  return (
    <View style={s.root}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <View style={s.iconBox}>
            <Text style={s.icon}>📚</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.eyebrow}>{t.eyebrow}</Text>
            <Text style={s.pageTitle}>{t.title}</Text>
          </View>
          <LangToggle />
        </View>

        <View style={s.xpCard}>
          <View style={s.xpLeft}>
            <Text style={s.xpLabel}>{t.xpLabel}</Text>
            <Text style={s.xpNum}>{xpTotal} <Text style={s.xpUnit}>{t.pts}</Text></Text>
          </View>
          <View style={s.xpRight}>
            <Text style={s.xpProgress}>{doneCount}/{total} {t.lessons}</Text>
            <XpBlocks pct={(doneCount / total) * 100} />
            <View style={s.levelRow}>
              <View style={s.levelBadge}>
                <Text style={s.levelText}>LVL {Math.floor(doneCount / 2) + 1}</Text>
              </View>
            </View>
          </View>
        </View>

        {t.sections.map((section) => (
          <View key={section.section}>
            <View style={s.sectionHeader}>
              <Text style={s.sectionEmoji}>{section.emoji}</Text>
              <Text style={s.sectionLabel}>{section.section}</Text>
              <View style={s.sectionLine} />
            </View>
            {section.items.map((lesson) => {
              const status = statuses[lesson.id];
              const fillPct = status === 'done' ? 100 : status === 'in-progress' ? 50 : 0;
              return (
                <TouchableOpacity
                  key={lesson.id}
                  style={[s.lessonCard, { backgroundColor: STATUS_BG[status], borderColor: STATUS_COLOR[status] + '44' }]}
                  onPress={() => setSelectedId(lesson.id)}
                  activeOpacity={0.75}
                >
                  <View style={[s.lessonIconBox, { backgroundColor: STATUS_COLOR[status] + '1A' }]}>
                    <Text style={s.lessonEmoji}>{lesson.emoji}</Text>
                  </View>
                  <View style={s.lessonInfo}>
                    <Text style={s.lessonTitle}>{lesson.title}</Text>
                    <Text style={[s.statusText, { color: STATUS_COLOR[status] }]}>
                      {statusLabel[status]}
                      {status === 'done' ? `  ·  ${lesson.xp} xp` : ''}
                      {status !== 'done' && lesson.duration ? `  ·  ${lesson.duration}` : ''}
                    </Text>
                    <View style={s.lessonBarTrack}>
                      <View style={[s.lessonBarFill, { width: `${fillPct}%`, backgroundColor: STATUS_COLOR[status] }]} />
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
      </ScrollView>

      <Modal visible={!!selected} transparent animationType="slide" onRequestClose={() => setSelectedId(null)}>
        <View style={s.modalOverlay}>
          <View style={s.modalCard}>
            {selected && (
              <>
                <View style={s.modalHeader}>
                  <Text style={s.modalEmoji}>{selected.emoji}</Text>
                  <Text style={s.modalTitle}>{selected.title}</Text>
                </View>
                <View style={s.modalXpBadge}>
                  <Text style={s.modalXpText}>+{selected.xp} XP</Text>
                </View>
                <Text style={s.modalBody}>{selected.body}</Text>
                <View style={s.modalRow}>
                  <TouchableOpacity
                    style={[s.modalBtn, s.modalBtnCancel]}
                    onPress={() => setSelectedId(null)}
                  >
                    <Text style={[s.modalBtnText, { color: '#9090B8' }]}>{t.close}</Text>
                  </TouchableOpacity>
                  {statuses[selected.id] !== 'done' && (
                    <TouchableOpacity
                      style={s.modalBtn}
                      onPress={() => { advance(selected.id); setSelectedId(null); }}
                    >
                      <Text style={s.modalBtnText}>
                        {statuses[selected.id] === 'not-started' ? t.start : t.markDone}
                      </Text>
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
  wrap: { flexDirection: 'row', backgroundColor: '#0F0F24', borderRadius: 20, borderWidth: 2, borderColor: '#7B3FFF66', overflow: 'hidden' },
  btn: { paddingHorizontal: 12, paddingVertical: 5 },
  active: { backgroundColor: '#7B3FFF' },
  divider: { width: 1, backgroundColor: '#7B3FFF44' },
  text: { fontSize: 11, fontWeight: '800', color: '#44446A', letterSpacing: 1, ...(FONT ? { fontFamily: FONT } : {}) },
  activeText: { color: '#fff' },
});

const xp = StyleSheet.create({
  row: { flexDirection: 'row', gap: 3 },
  block: { width: 14, height: 10, borderRadius: 3 },
});

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#08081A' },
  scroll: { paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 56 : 40, paddingBottom: 104, gap: 12 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
  iconBox: { width: 52, height: 52, borderRadius: 16, backgroundColor: '#0D1E2A', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#00E5A844' },
  icon: { fontSize: 26 },
  eyebrow: { fontSize: 10, color: '#00E5A8', fontWeight: '800', letterSpacing: 2, ...(FONT ? { fontFamily: FONT } : {}) },
  pageTitle: { fontSize: 26, fontWeight: '800', color: '#fff', ...(FONT ? { fontFamily: FONT } : {}) },
  xpCard: { backgroundColor: '#0C1C18', borderRadius: 20, padding: 16, borderWidth: 1.5, borderColor: '#00E5A844', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  xpLeft: { gap: 4 },
  xpLabel: { fontSize: 10, color: '#00E5A8', fontWeight: '800', letterSpacing: 2, ...(FONT ? { fontFamily: FONT } : {}) },
  xpNum: { fontSize: 34, fontWeight: '800', color: '#FFD060', ...(FONT ? { fontFamily: FONT } : {}) },
  xpUnit: { fontSize: 16, color: '#9090B8', fontWeight: '400' },
  xpRight: { alignItems: 'flex-end', gap: 6 },
  xpProgress: { fontSize: 11, color: '#9090B8' },
  levelRow: { flexDirection: 'row' },
  levelBadge: { backgroundColor: '#7B3FFF', borderRadius: 50, paddingHorizontal: 12, paddingVertical: 4 },
  levelText: { color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 1, ...(FONT ? { fontFamily: FONT } : {}) },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8, marginBottom: 6 },
  sectionEmoji: { fontSize: 16 },
  sectionLabel: { fontSize: 12, color: '#9090B8', fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', ...(FONT ? { fontFamily: FONT } : {}) },
  sectionLine: { flex: 1, height: 1, backgroundColor: '#1C1C38' },
  lessonCard: { borderRadius: 20, padding: 14, borderWidth: 1.5, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  lessonIconBox: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  lessonEmoji: { fontSize: 22 },
  lessonInfo: { flex: 1, gap: 4 },
  lessonTitle: { fontSize: 14, fontWeight: '700', color: '#fff', ...(FONT ? { fontFamily: FONT } : {}) },
  statusText: { fontSize: 11, fontWeight: '600' },
  lessonBarTrack: { width: '100%', height: 4, backgroundColor: '#1C1C38', borderRadius: 4, overflow: 'hidden', marginTop: 2 },
  lessonBarFill: { height: '100%', borderRadius: 4 },
  chevron: { fontSize: 22, color: '#3C3C5C', fontWeight: '300' },
  footerBadge: { alignSelf: 'center', borderWidth: 2, borderColor: '#FFD060', borderRadius: 50, paddingHorizontal: 22, paddingVertical: 8, marginTop: 4 },
  footerText: { color: '#FFD060', fontSize: 12, fontWeight: '800', letterSpacing: 2, ...(FONT ? { fontFamily: FONT } : {}) },
  modalOverlay: { flex: 1, backgroundColor: '#000000CC', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#0F0F24', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, gap: 14, borderTopWidth: 1.5, borderColor: '#7B3FFF' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  modalEmoji: { fontSize: 28 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#fff', flex: 1, ...(FONT ? { fontFamily: FONT } : {}) },
  modalXpBadge: { alignSelf: 'flex-start', backgroundColor: '#FFD060', borderRadius: 50, paddingHorizontal: 14, paddingVertical: 5 },
  modalXpText: { color: '#08081A', fontSize: 13, fontWeight: '800', ...(FONT ? { fontFamily: FONT } : {}) },
  modalBody: { fontSize: 14, color: '#C0C0D8', lineHeight: 22 },
  modalRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  modalBtn: { flex: 1, backgroundColor: '#7B3FFF', borderRadius: 50, paddingVertical: 14, alignItems: 'center' },
  modalBtnCancel: { backgroundColor: '#15152C', borderWidth: 1.5, borderColor: '#1C1C38' },
  modalBtnText: { color: '#fff', fontSize: 14, fontWeight: '700', ...(FONT ? { fontFamily: FONT } : {}) },
});
