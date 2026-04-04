import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Modal, Platform,
} from 'react-native';
import { useLocale } from '@/context/AppContext';

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
  done: '#1db896',
  'in-progress': '#FFE566',
  'not-started': '#2a3a3a',
};
const STATUS_BG: Record<Status, string> = {
  done: '#0d2a22',
  'in-progress': '#2a2000',
  'not-started': '#1a2a2a',
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
        <View key={i} style={[xp.block, { backgroundColor: i < filled ? '#1db896' : '#1e3333' }]} />
      ))}
    </View>
  );
}

export default function LearnScreen() {
  const { locale } = useLocale();
  const t = T[locale];

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<Record<string, Status>>(INITIAL_STATUSES);

  const allItems = t.sections.flatMap((s) => s.items);
  const selected = selectedId ? allItems.find((i) => i.id === selectedId) ?? null : null;

  function advance(id: string) {
    setStatuses((prev) => {
      const cur = prev[id];
      const next: Status = cur === 'not-started' ? 'in-progress' : 'done';
      return { ...prev, [id]: next };
    });
  }

  const doneCount = Object.values(statuses).filter((s) => s === 'done').length;
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
        <View style={s.retroHeader}>
          <View style={s.retroIconBox}>
            <Text style={s.retroIcon}>📚</Text>
          </View>
          <View>
            <Text style={s.retroEyebrow}>{t.eyebrow}</Text>
            <Text style={s.pageTitle}>{t.title}</Text>
          </View>
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
                  style={[s.lessonCard, { backgroundColor: STATUS_BG[status], borderColor: STATUS_COLOR[status] + '55' }]}
                  onPress={() => setSelectedId(lesson.id)}
                  activeOpacity={0.75}
                >
                  <View style={[s.lessonIconBox, { backgroundColor: STATUS_COLOR[status] + '22' }]}>
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
                    style={[s.modalBtn, { backgroundColor: '#1e3333', borderColor: '#2a4a4a' }]}
                    onPress={() => setSelectedId(null)}
                  >
                    <Text style={[s.modalBtnText, { color: '#8ab8b8' }]}>{t.close}</Text>
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

const xp = StyleSheet.create({
  row: { flexDirection: 'row', gap: 3 },
  block: { width: 14, height: 10, borderRadius: 2 },
});

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0d1a1a' },
  scroll: { paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 56 : 40, paddingBottom: 32, gap: 12 },
  retroHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
  retroIconBox: { width: 52, height: 52, borderRadius: 10, backgroundColor: '#1a4a3a', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#1db896' },
  retroIcon: { fontSize: 26 },
  retroEyebrow: { fontSize: 10, color: '#1db896', fontWeight: '800', letterSpacing: 2 },
  pageTitle: { fontSize: 26, fontWeight: '800', color: '#fff' },
  xpCard: { backgroundColor: '#0d2a22', borderRadius: 12, padding: 16, borderWidth: 2, borderColor: '#1db89666', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  xpLeft: { gap: 4 },
  xpLabel: { fontSize: 10, color: '#1db896', fontWeight: '800', letterSpacing: 2 },
  xpNum: { fontSize: 32, fontWeight: '800', color: '#FFE566' },
  xpUnit: { fontSize: 16, color: '#8ab8b8', fontWeight: '400' },
  xpRight: { alignItems: 'flex-end', gap: 6 },
  xpProgress: { fontSize: 11, color: '#8ab8b8' },
  levelRow: { flexDirection: 'row' },
  levelBadge: { backgroundColor: '#1db896', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 3 },
  levelText: { color: '#0d1a1a', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8, marginBottom: 6 },
  sectionEmoji: { fontSize: 16 },
  sectionLabel: { fontSize: 12, color: '#8ab8b8', fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  sectionLine: { flex: 1, height: 1, backgroundColor: '#1e3333' },
  lessonCard: { borderRadius: 12, padding: 14, borderWidth: 2, flexDirection: 'row', alignItems: 'center', gap: 12 },
  lessonIconBox: { width: 48, height: 48, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  lessonEmoji: { fontSize: 22 },
  lessonInfo: { flex: 1, gap: 4 },
  lessonTitle: { fontSize: 14, fontWeight: '700', color: '#fff' },
  statusText: { fontSize: 11, fontWeight: '600' },
  lessonBarTrack: { width: '100%', height: 4, backgroundColor: '#1e3333', borderRadius: 2, overflow: 'hidden', marginTop: 2 },
  lessonBarFill: { height: '100%', borderRadius: 2 },
  chevron: { fontSize: 22, color: '#3a6868', fontWeight: '300' },
  footerBadge: { alignSelf: 'center', borderWidth: 2, borderColor: '#FFE566', borderRadius: 8, paddingHorizontal: 20, paddingVertical: 8, marginTop: 4 },
  footerText: { color: '#FFE566', fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  modalOverlay: { flex: 1, backgroundColor: '#000000bb', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#0d1e1e', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, gap: 14, borderTopWidth: 3, borderColor: '#7C5CBF' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  modalEmoji: { fontSize: 28 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#fff', flex: 1 },
  modalXpBadge: { alignSelf: 'flex-start', backgroundColor: '#FFE566', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 4 },
  modalXpText: { color: '#0d1a1a', fontSize: 13, fontWeight: '800' },
  modalBody: { fontSize: 14, color: '#c0dada', lineHeight: 22 },
  modalRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  modalBtn: { flex: 1, backgroundColor: '#1db896', borderRadius: 8, paddingVertical: 13, alignItems: 'center', borderWidth: 2, borderColor: '#16a07a' },
  modalBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
