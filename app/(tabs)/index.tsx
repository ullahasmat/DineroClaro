import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, Modal, StyleSheet, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useLocale } from '@/context/AppContext';

const T = {
  en: {
    eyebrow: '◆ DINERO CLARO ◆',
    title: 'My finances',
    snapshot: 'Your snapshot',
    creditScore: 'CREDIT SCORE',
    goal: 'Goal',
    income: 'INCOME',
    incomePrompt: 'Monthly income:',
    checking: 'CHECKING',
    checkingPrompt: 'Checking balance:',
    tapEdit: 'tap to edit',
    creditCard: 'Credit card',
    used: 'used',
    balance: 'balance',
    addCard: '＋ Add another card or account',
    tipTitle: 'Keep data fresh',
    tipBody: 'Update your numbers monthly for better recommendations.',
    seeRec: 'See recommendations  ▶▶',
    modalTitle: '💳  Add a card or account',
    cardName: 'Card name',
    currentBalance: 'Current balance',
    creditLimit: 'Credit limit',
    cancel: 'Cancel',
    add: 'Add  ✓',
  },
  es: {
    eyebrow: '◆ DINERO CLARO ◆',
    title: 'Mis finanzas',
    snapshot: 'Tu resumen',
    creditScore: 'PUNTAJE DE CRÉDITO',
    goal: 'Meta',
    income: 'INGRESOS',
    incomePrompt: 'Ingreso mensual:',
    checking: 'CUENTA',
    checkingPrompt: 'Saldo en cuenta:',
    tapEdit: 'toca para editar',
    creditCard: 'Tarjeta de crédito',
    used: 'usado',
    balance: 'saldo',
    addCard: '＋ Agregar tarjeta o cuenta',
    tipTitle: 'Mantén tus datos al día',
    tipBody: 'Actualiza tus números cada mes para mejores recomendaciones.',
    seeRec: 'Ver recomendaciones  ▶▶',
    modalTitle: '💳  Agregar tarjeta o cuenta',
    cardName: 'Nombre de la tarjeta',
    currentBalance: 'Saldo actual',
    creditLimit: 'Límite de crédito',
    cancel: 'Cancelar',
    add: 'Agregar  ✓',
  },
};

type Card = { name: string; balance: number; limit: number };
const DEFAULT_CARDS: Card[] = [{ name: 'Discover Secured', balance: 110, limit: 500 }];

function PixelRow({ color = '#1db896' }: { color?: string }) {
  return (
    <View style={r.pixelRow}>
      {Array.from({ length: 12 }).map((_, i) => (
        <View key={i} style={[r.pixel, { backgroundColor: i % 2 === 0 ? color : 'transparent' }]} />
      ))}
    </View>
  );
}

function Stamp({ label, color }: { label: string; color: string }) {
  return (
    <View style={[r.stamp, { borderColor: color }]}>
      <Text style={[r.stampText, { color }]}>{label}</Text>
    </View>
  );
}

export default function FinancesScreen() {
  const router = useRouter();
  const { locale } = useLocale();
  const t = T[locale];

  const [income, setIncome] = useState(2400);
  const [checking, setChecking] = useState(1240);
  const [creditScore] = useState(642);
  const [cards, setCards] = useState<Card[]>(DEFAULT_CARDS);
  const [modalVisible, setModalVisible] = useState(false);
  const [newCard, setNewCard] = useState({ name: '', balance: '', limit: '' });

  const scoreGoal = 720;
  const scoreMin = 300;
  const scorePct = ((creditScore - scoreMin) / (scoreGoal - scoreMin)) * 100;

  function addCard() {
    if (!newCard.name.trim()) return;
    setCards((prev) => [
      ...prev,
      { name: newCard.name, balance: parseFloat(newCard.balance) || 0, limit: parseFloat(newCard.limit) || 0 },
    ]);
    setNewCard({ name: '', balance: '', limit: '' });
    setModalVisible(false);
  }

  return (
    <View style={s.root}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.retroHeader}>
          <View style={s.retroIconBox}>
            <Text style={s.retroIcon}>💰</Text>
          </View>
          <View style={s.retroTitleBlock}>
            <Text style={s.retroEyebrow}>{t.eyebrow}</Text>
            <Text style={s.pageTitle}>{t.title}</Text>
          </View>
        </View>
        <PixelRow color="#FFE566" />

        <View style={s.snapshotRow}>
          <Text style={s.sectionLabel}>{t.snapshot}</Text>
          <Stamp label="● LIVE" color="#1db896" />
        </View>

        <View style={[s.card, s.cardAccentYellow]}>
          <View style={s.cardTopRow}>
            <Text style={s.cardLabel}>{t.creditScore}</Text>
            <Text style={s.retroStar}>⭐</Text>
          </View>
          <Text style={s.scoreValue}>{creditScore}</Text>
          <View style={s.progressTrack}>
            <View style={[s.progressFill, { width: `${Math.min(scorePct, 100)}%` }]} />
          </View>
          <View style={s.scoreRow}>
            <Text style={s.scoreEdge}>{scoreMin}</Text>
            <Text style={s.scoreGoalText}>▶ {t.goal}: {scoreGoal}</Text>
          </View>
        </View>

        <View style={s.grid2}>
          <TouchableOpacity
            style={[s.card, s.flex1, s.cardAccentPink]}
            onPress={() => { const val = prompt(t.incomePrompt, String(income)); if (val) setIncome(parseFloat(val) || income); }}
            activeOpacity={0.7}
          >
            <Text style={s.cardLabel}>{t.income}</Text>
            <Text style={s.retroEmoji}>💵</Text>
            <Text style={s.bigNum}>${income.toLocaleString()}</Text>
            <Text style={s.editHint}>{t.tapEdit}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.card, s.flex1, s.cardAccentBlue]}
            onPress={() => { const val = prompt(t.checkingPrompt, String(checking)); if (val) setChecking(parseFloat(val) || checking); }}
            activeOpacity={0.7}
          >
            <Text style={s.cardLabel}>{t.checking}</Text>
            <Text style={s.retroEmoji}>🏦</Text>
            <Text style={s.bigNum}>${checking.toLocaleString()}</Text>
            <Text style={s.editHint}>{t.tapEdit}</Text>
          </TouchableOpacity>
        </View>

        <PixelRow color="#7C5CBF" />
        <Text style={s.sectionLabel}>{t.creditCard}</Text>

        {cards.map((card, i) => {
          const util = card.limit > 0 ? (card.balance / card.limit) * 100 : 0;
          return (
            <View key={i} style={[s.card, s.cardAccentGreen]}>
              <View style={s.cardTopRow}>
                <Text style={s.cardName}>💳  {card.name}</Text>
                <Stamp label={`${Math.round(util)}% ${t.used}`} color={util < 30 ? '#1db896' : '#FF6B6B'} />
              </View>
              <View style={s.progressTrack}>
                <View style={[s.progressFill, { width: `${Math.min(util, 100)}%`, backgroundColor: util < 30 ? '#1db896' : '#FF6B6B' }]} />
              </View>
              <Text style={s.cardBalance}>${card.balance} {t.balance}</Text>
            </View>
          );
        })}

        <TouchableOpacity style={s.addCard} onPress={() => setModalVisible(true)} activeOpacity={0.7}>
          <Text style={s.addCardText}>{t.addCard}</Text>
        </TouchableOpacity>

        <View style={s.tip}>
          <Text style={s.tipIcon}>📟</Text>
          <View>
            <Text style={s.tipTitle}>{t.tipTitle}</Text>
            <Text style={s.tipBody}>{t.tipBody}</Text>
          </View>
        </View>

        <TouchableOpacity style={s.recBtn} onPress={() => router.push('/(tabs)/profile')} activeOpacity={0.85}>
          <Text style={s.recBtnText}>{t.seeRec}</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={s.modalOverlay}>
          <View style={s.modalCard}>
            <PixelRow color="#FFE566" />
            <Text style={s.modalTitle}>{t.modalTitle}</Text>
            <TextInput style={s.input} placeholder={t.cardName} placeholderTextColor="#5a8888" value={newCard.name} onChangeText={(v) => setNewCard((p) => ({ ...p, name: v }))} />
            <TextInput style={s.input} placeholder={t.currentBalance} placeholderTextColor="#5a8888" keyboardType="numeric" value={newCard.balance} onChangeText={(v) => setNewCard((p) => ({ ...p, balance: v }))} />
            <TextInput style={s.input} placeholder={t.creditLimit} placeholderTextColor="#5a8888" keyboardType="numeric" value={newCard.limit} onChangeText={(v) => setNewCard((p) => ({ ...p, limit: v }))} />
            <View style={s.modalRow}>
              <TouchableOpacity style={[s.modalBtn, { backgroundColor: '#1e3333' }]} onPress={() => setModalVisible(false)}>
                <Text style={[s.modalBtnText, { color: '#8ab8b8' }]}>{t.cancel}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.modalBtn} onPress={addCard}>
                <Text style={s.modalBtnText}>{t.add}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const r = StyleSheet.create({
  pixelRow: { flexDirection: 'row', gap: 4, paddingVertical: 4 },
  pixel: { width: 8, height: 8, borderRadius: 1 },
  stamp: { borderWidth: 2, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 2 },
  stampText: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
});

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0d1a1a' },
  scroll: { paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 56 : 40, paddingBottom: 32, gap: 12 },
  retroHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
  retroIconBox: { width: 52, height: 52, borderRadius: 10, backgroundColor: '#FFE566', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#c9b840' },
  retroIcon: { fontSize: 26 },
  retroTitleBlock: { gap: 2 },
  retroEyebrow: { fontSize: 10, color: '#FFE566', fontWeight: '800', letterSpacing: 2 },
  pageTitle: { fontSize: 26, fontWeight: '800', color: '#fff' },
  snapshotRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionLabel: { fontSize: 13, color: '#8ab8b8', fontWeight: '600', letterSpacing: 0.5 },
  card: { backgroundColor: '#1a2a2a', borderRadius: 12, padding: 16, gap: 8, borderWidth: 2, borderColor: 'transparent' },
  cardAccentYellow: { borderColor: '#FFE56633' },
  cardAccentPink: { borderColor: '#FF6B6B33' },
  cardAccentBlue: { borderColor: '#7C5CBF33' },
  cardAccentGreen: { borderColor: '#1db89633' },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLabel: { fontSize: 11, color: '#8ab8b8', textTransform: 'uppercase', letterSpacing: 1, fontWeight: '700' },
  retroStar: { fontSize: 16 },
  retroEmoji: { fontSize: 22 },
  scoreValue: { fontSize: 40, fontWeight: '800', color: '#FFE566' },
  progressTrack: { width: '100%', height: 8, backgroundColor: '#1e3333', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#1db896', borderRadius: 2 },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between' },
  scoreEdge: { fontSize: 12, color: '#5a8888' },
  scoreGoalText: { fontSize: 12, color: '#1db896', fontWeight: '700' },
  grid2: { flexDirection: 'row', gap: 12 },
  flex1: { flex: 1 },
  bigNum: { fontSize: 22, fontWeight: '800', color: '#fff' },
  editHint: { fontSize: 10, color: '#3a6868', letterSpacing: 0.5 },
  cardName: { fontSize: 15, fontWeight: '700', color: '#fff' },
  cardBalance: { fontSize: 12, color: '#8ab8b8' },
  addCard: { borderWidth: 2, borderColor: '#1e3d3d', borderStyle: 'dashed', borderRadius: 12, padding: 16, alignItems: 'center' },
  addCardText: { color: '#5a8888', fontSize: 14, fontWeight: '600' },
  tip: { backgroundColor: '#0d2a22', borderRadius: 12, padding: 14, borderWidth: 2, borderColor: '#1db89640', flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  tipIcon: { fontSize: 22, marginTop: 2 },
  tipTitle: { fontSize: 14, fontWeight: '800', color: '#1db896' },
  tipBody: { fontSize: 13, color: '#8ab8b8', lineHeight: 18, marginTop: 2 },
  recBtn: { backgroundColor: '#1db896', borderRadius: 10, paddingVertical: 14, alignItems: 'center', borderWidth: 3, borderColor: '#16a07a' },
  recBtnText: { color: '#fff', fontSize: 15, fontWeight: '800', letterSpacing: 1 },
  modalOverlay: { flex: 1, backgroundColor: '#000000bb', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#122222', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, gap: 12, borderTopWidth: 3, borderColor: '#FFE566' },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#fff', marginBottom: 4 },
  input: { backgroundColor: '#1a3333', borderWidth: 2, borderColor: '#1e3d3d', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12, color: '#fff', fontSize: 14 },
  modalRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  modalBtn: { flex: 1, backgroundColor: '#1db896', borderRadius: 8, paddingVertical: 13, alignItems: 'center', borderWidth: 2, borderColor: '#16a07a' },
  modalBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
