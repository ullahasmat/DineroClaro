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
    creditCard: 'Credit cards',
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
    creditCard: 'Tarjetas de crédito',
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

function Glow({ color }: { color: string }) {
  return (
    <View style={[g.bar, { backgroundColor: color }]} />
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
        <View style={s.header}>
          <View style={s.iconBox}>
            <Text style={s.icon}>💰</Text>
          </View>
          <View style={s.titleBlock}>
            <Text style={s.eyebrow}>{t.eyebrow}</Text>
            <Text style={s.pageTitle}>{t.title}</Text>
          </View>
          <LangToggle />
        </View>
        <Glow color="#FFD06044" />

        <View style={s.snapshotRow}>
          <Text style={s.sectionLabel}>{t.snapshot}</Text>
          <Stamp label="● LIVE" color="#00E5A8" />
        </View>

        <View style={[s.card, s.cardGold]}>
          <View style={s.cardTopRow}>
            <Text style={s.cardLabel}>{t.creditScore}</Text>
            <Text style={s.retroStar}>⭐</Text>
          </View>
          <Text style={s.scoreValue}>{creditScore}</Text>
          <View style={s.progressTrack}>
            <View style={[s.progressFill, { width: `${Math.min(scorePct, 100)}%`, backgroundColor: '#FFD060' }]} />
          </View>
          <View style={s.scoreRow}>
            <Text style={s.scoreEdge}>{scoreMin}</Text>
            <Text style={[s.scoreGoalText, { color: '#FFD060' }]}>▶ {t.goal}: {scoreGoal}</Text>
          </View>
        </View>

        <View style={s.grid2}>
          <TouchableOpacity
            style={[s.card, s.flex1, s.cardPink]}
            onPress={() => { const val = prompt(t.incomePrompt, String(income)); if (val) setIncome(parseFloat(val) || income); }}
            activeOpacity={0.75}
          >
            <Text style={s.cardLabel}>{t.income}</Text>
            <Text style={s.retroEmoji}>💵</Text>
            <Text style={s.bigNum}>${income.toLocaleString()}</Text>
            <Text style={s.editHint}>{t.tapEdit}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.card, s.flex1, s.cardViolet]}
            onPress={() => { const val = prompt(t.checkingPrompt, String(checking)); if (val) setChecking(parseFloat(val) || checking); }}
            activeOpacity={0.75}
          >
            <Text style={s.cardLabel}>{t.checking}</Text>
            <Text style={s.retroEmoji}>🏦</Text>
            <Text style={s.bigNum}>${checking.toLocaleString()}</Text>
            <Text style={s.editHint}>{t.tapEdit}</Text>
          </TouchableOpacity>
        </View>

        <Glow color="#7B3FFF44" />
        <Text style={s.sectionLabel}>{t.creditCard}</Text>

        {cards.map((card, i) => {
          const util = card.limit > 0 ? (card.balance / card.limit) * 100 : 0;
          return (
            <View key={i} style={[s.card, s.cardMint]}>
              <View style={s.cardTopRow}>
                <Text style={s.cardName}>💳  {card.name}</Text>
                <Stamp label={`${Math.round(util)}% ${t.used}`} color={util < 30 ? '#00E5A8' : '#FF3B8B'} />
              </View>
              <View style={s.progressTrack}>
                <View style={[s.progressFill, { width: `${Math.min(util, 100)}%`, backgroundColor: util < 30 ? '#00E5A8' : '#FF3B8B' }]} />
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
          <View style={s.tipTextBlock}>
            <Text style={s.tipTitle}>{t.tipTitle}</Text>
            <Text style={s.tipBody}>{t.tipBody}</Text>
          </View>
        </View>

        <TouchableOpacity style={s.recBtn} onPress={() => router.push('/(tabs)/recommendations')} activeOpacity={0.85}>
          <Text style={s.recBtnText}>{t.seeRec}</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={s.modalOverlay}>
          <View style={s.modalCard}>
            <Glow color="#FFD06066" />
            <Text style={s.modalTitle}>{t.modalTitle}</Text>
            <TextInput style={s.input} placeholder={t.cardName} placeholderTextColor="#44446A" value={newCard.name} onChangeText={(v) => setNewCard((p) => ({ ...p, name: v }))} />
            <TextInput style={s.input} placeholder={t.currentBalance} placeholderTextColor="#44446A" keyboardType="numeric" value={newCard.balance} onChangeText={(v) => setNewCard((p) => ({ ...p, balance: v }))} />
            <TextInput style={s.input} placeholder={t.creditLimit} placeholderTextColor="#44446A" keyboardType="numeric" value={newCard.limit} onChangeText={(v) => setNewCard((p) => ({ ...p, limit: v }))} />
            <View style={s.modalRow}>
              <TouchableOpacity style={[s.modalBtn, s.modalBtnCancel]} onPress={() => setModalVisible(false)}>
                <Text style={[s.modalBtnText, { color: '#9090B8' }]}>{t.cancel}</Text>
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

const lt = StyleSheet.create({
  wrap: { flexDirection: 'row', backgroundColor: '#0F0F24', borderRadius: 20, borderWidth: 2, borderColor: '#7B3FFF66', overflow: 'hidden' },
  btn: { paddingHorizontal: 12, paddingVertical: 5 },
  active: { backgroundColor: '#7B3FFF' },
  divider: { width: 1, backgroundColor: '#7B3FFF44' },
  text: { fontSize: 11, fontWeight: '800', color: '#44446A', letterSpacing: 1, ...(Platform.OS === 'ios' ? { fontFamily: 'Avenir Next' } : {}) },
  activeText: { color: '#fff' },
});

const g = StyleSheet.create({
  bar: { height: 3, borderRadius: 2, marginVertical: 2 },
});

const r = StyleSheet.create({
  stamp: { borderWidth: 2, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  stampText: { fontSize: 10, fontWeight: '800', letterSpacing: 1, ...(Platform.OS === 'ios' ? { fontFamily: 'Avenir Next' } : {}) },
});

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#08081A' },
  scroll: { paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 56 : 40, paddingBottom: 104, gap: 12 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
  iconBox: { width: 52, height: 52, borderRadius: 16, backgroundColor: '#2A1A00', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFD06055' },
  icon: { fontSize: 26 },
  titleBlock: { flex: 1, gap: 2 },
  eyebrow: { fontSize: 10, color: '#FFD060', fontWeight: '800', letterSpacing: 2, ...(FONT ? { fontFamily: FONT } : {}) },
  pageTitle: { fontSize: 26, fontWeight: '800', color: '#fff', ...(FONT ? { fontFamily: FONT } : {}) },
  snapshotRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionLabel: { fontSize: 12, color: '#9090B8', fontWeight: '600', letterSpacing: 0.5, ...(FONT ? { fontFamily: FONT } : {}) },
  card: { backgroundColor: '#0F0F24', borderRadius: 20, padding: 16, gap: 8, borderWidth: 1.5, borderColor: 'transparent' },
  cardGold: { borderColor: '#FFD06033' },
  cardPink: { borderColor: '#FF3B8B33' },
  cardViolet: { borderColor: '#7B3FFF44' },
  cardMint: { borderColor: '#00E5A833' },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLabel: { fontSize: 11, color: '#9090B8', textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: '700', ...(FONT ? { fontFamily: FONT } : {}) },
  retroStar: { fontSize: 16 },
  retroEmoji: { fontSize: 22 },
  scoreValue: { fontSize: 42, fontWeight: '800', color: '#FFD060', ...(FONT ? { fontFamily: FONT } : {}) },
  progressTrack: { width: '100%', height: 6, backgroundColor: '#1C1C38', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#00E5A8', borderRadius: 4 },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between' },
  scoreEdge: { fontSize: 12, color: '#44446A' },
  scoreGoalText: { fontSize: 12, fontWeight: '700' },
  grid2: { flexDirection: 'row', gap: 12 },
  flex1: { flex: 1 },
  bigNum: { fontSize: 22, fontWeight: '800', color: '#fff', ...(FONT ? { fontFamily: FONT } : {}) },
  editHint: { fontSize: 10, color: '#3C3C5C', letterSpacing: 0.5 },
  cardName: { fontSize: 15, fontWeight: '700', color: '#fff', ...(FONT ? { fontFamily: FONT } : {}) },
  cardBalance: { fontSize: 12, color: '#9090B8' },
  addCard: { borderWidth: 1.5, borderColor: '#1C1C38', borderStyle: 'dashed', borderRadius: 20, padding: 16, alignItems: 'center' },
  addCardText: { color: '#44446A', fontSize: 14, fontWeight: '600' },
  tip: { backgroundColor: '#0C0C1E', borderRadius: 20, padding: 14, borderWidth: 1.5, borderColor: '#00E5A822', flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  tipTextBlock: { flex: 1 },
  tipIcon: { fontSize: 22, marginTop: 2 },
  tipTitle: { fontSize: 14, fontWeight: '800', color: '#00E5A8', ...(FONT ? { fontFamily: FONT } : {}) },
  tipBody: { fontSize: 13, color: '#9090B8', lineHeight: 18, marginTop: 2 },
  recBtn: { backgroundColor: '#7B3FFF', borderRadius: 50, paddingVertical: 15, alignItems: 'center', borderWidth: 0 },
  recBtnText: { color: '#fff', fontSize: 15, fontWeight: '800', letterSpacing: 0.8, ...(FONT ? { fontFamily: FONT } : {}) },
  modalOverlay: { flex: 1, backgroundColor: '#000000CC', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#0F0F24', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, gap: 12, borderTopWidth: 1.5, borderColor: '#FFD060' },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#fff', marginBottom: 4, ...(FONT ? { fontFamily: FONT } : {}) },
  input: { backgroundColor: '#15152C', borderWidth: 1.5, borderColor: '#1C1C38', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, color: '#fff', fontSize: 14 },
  modalRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  modalBtn: { flex: 1, backgroundColor: '#7B3FFF', borderRadius: 50, paddingVertical: 14, alignItems: 'center' },
  modalBtnCancel: { backgroundColor: '#15152C', borderWidth: 1.5, borderColor: '#1C1C38' },
  modalBtnText: { color: '#fff', fontSize: 15, fontWeight: '700', ...(FONT ? { fontFamily: FONT } : {}) },
});
