import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, Modal, StyleSheet, Platform,
} from 'react-native';
import { useLocale } from '@/context/AppContext';

const FONT = Platform.OS === 'ios' ? 'Avenir Next' : undefined;
const FF = FONT ? { fontFamily: FONT } : {};

const C = {
  bg:      '#F0F5FC',
  card:    '#FFFFFF',
  border:  '#D6E8F5',
  navy:    '#1B3B6F',
  blue:    '#3B73B9',
  gold:    '#C4991A',
  text:    '#0E1E3D',
  text2:   '#4B6080',
  text3:   '#8FA7C0',
  green:   '#1A7A56',
  red:     '#D44242',
  tintN:   '#EBF0FA',
  tintG:   '#FDF7E6',
  tintB:   '#EBF4FF',
  tintGr:  '#E8F5EF',
};

const T = {
  en: {
    eyebrow: 'DINERO CLARO',
    title: 'My Finances',
    snapshot: 'Your snapshot',
    creditScore: 'CREDIT SCORE',
    goal: 'Goal',
    income: 'INCOME',
    incomePrompt: 'Monthly income:',
    checking: 'CHECKING',
    checkingPrompt: 'Checking balance:',
    tapEdit: 'Tap to edit',
    creditCard: 'Credit Cards',
    used: 'used',
    balance: 'balance',
    addCard: '+ Add a card or account',
    tipTitle: 'Keep data fresh',
    tipBody: 'Update your numbers monthly for better recommendations.',
    modalTitle: 'Add a Card or Account',
    cardName: 'Card name',
    currentBalance: 'Current balance',
    creditLimit: 'Credit limit',
    cancel: 'Cancel',
    add: 'Add',
  },
  es: {
    eyebrow: 'DINERO CLARO',
    title: 'Mis Finanzas',
    snapshot: 'Tu resumen',
    creditScore: 'PUNTAJE DE CRÉDITO',
    goal: 'Meta',
    income: 'INGRESOS',
    incomePrompt: 'Ingreso mensual:',
    checking: 'CUENTA',
    checkingPrompt: 'Saldo en cuenta:',
    tapEdit: 'Toca para editar',
    creditCard: 'Tarjetas de Crédito',
    used: 'usado',
    balance: 'saldo',
    addCard: '+ Agregar tarjeta o cuenta',
    tipTitle: 'Mantén tus datos al día',
    tipBody: 'Actualiza tus números cada mes para mejores recomendaciones.',
    modalTitle: 'Agregar Tarjeta o Cuenta',
    cardName: 'Nombre de la tarjeta',
    currentBalance: 'Saldo actual',
    creditLimit: 'Límite de crédito',
    cancel: 'Cancelar',
    add: 'Agregar',
  },
};

type Card = { name: string; balance: number; limit: number };
const DEFAULT_CARDS: Card[] = [{ name: 'Discover Secured', balance: 110, limit: 500 }];

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

function Divider() {
  return <View style={{ height: 1, backgroundColor: C.border, marginVertical: 2 }} />;
}

export default function FinancesScreen() {
  const { locale, financialProfile, setFinancialProfile } = useLocale();
  const t = T[locale];

  const [income, setIncome] = useState(() => parseFloat(financialProfile.income) || 2400);
  const [checking, setChecking] = useState(() => parseFloat(financialProfile.checking) || 1240);
  const [creditScore] = useState(() => parseFloat(financialProfile.creditScore) || 642);
  const [cards, setCards] = useState<Card[]>(() =>
    financialProfile.cards.length > 0
      ? financialProfile.cards.map(c => ({ name: c.name, balance: parseFloat(c.balance) || 0, limit: parseFloat(c.limit) || 0 }))
      : DEFAULT_CARDS
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [newCard, setNewCard] = useState({ name: '', balance: '', limit: '' });

  const scoreGoal = 720;
  const scoreMin = 300;
  const scorePct = ((creditScore - scoreMin) / (scoreGoal - scoreMin)) * 100;

  function syncFinancials(updatedCards?: Card[]) {
    const c = updatedCards ?? cards;
    setFinancialProfile({
      creditScore: String(creditScore),
      income: String(income),
      checking: String(checking),
      cards: c.map(card => ({ name: card.name, balance: String(card.balance), limit: String(card.limit) })),
    });
  }

  function addCard() {
    if (!newCard.name.trim()) return;
    const card = { name: newCard.name, balance: parseFloat(newCard.balance) || 0, limit: parseFloat(newCard.limit) || 0 };
    const updated = [...cards, card];
    setCards(updated);
    setNewCard({ name: '', balance: '', limit: '' });
    setModalVisible(false);
    syncFinancials(updated);
  }

  return (
    <View style={s.root}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.eyebrow}>{t.eyebrow}</Text>
            <Text style={s.pageTitle}>{t.title}</Text>
          </View>
          <LangToggle />
        </View>

        {/* Credit Score */}
        <View style={[s.card, s.cardGold]}>
          <View style={s.cardRow}>
            <Text style={s.cardLabel}>{t.creditScore}</Text>
            <Text style={s.badge}>⭐ Fair</Text>
          </View>
          <Text style={s.scoreValue}>{creditScore}</Text>
          <View style={s.trackWrap}>
            <View style={[s.trackFill, { width: `${Math.min(scorePct, 100)}%` }]} />
          </View>
          <View style={s.scoreRow}>
            <Text style={s.scoreEdge}>{scoreMin}</Text>
            <Text style={s.scoreGoal}>{t.goal}: {scoreGoal}</Text>
          </View>
        </View>

        {/* Income + Checking */}
        <View style={s.grid2}>
          <TouchableOpacity style={[s.card, s.flex1]} onPress={() => { const v = prompt(t.incomePrompt, String(income)); if (v) setIncome(parseFloat(v) || income); }} activeOpacity={0.75}>
            <Text style={s.cardLabel}>{t.income}</Text>
            <Text style={s.cardEmoji}>💵</Text>
            <Text style={s.bigNum}>${income.toLocaleString()}</Text>
            <Text style={s.tapHint}>{t.tapEdit}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.card, s.flex1]} onPress={() => { const v = prompt(t.checkingPrompt, String(checking)); if (v) setChecking(parseFloat(v) || checking); }} activeOpacity={0.75}>
            <Text style={s.cardLabel}>{t.checking}</Text>
            <Text style={s.cardEmoji}>🏦</Text>
            <Text style={s.bigNum}>${checking.toLocaleString()}</Text>
            <Text style={s.tapHint}>{t.tapEdit}</Text>
          </TouchableOpacity>
        </View>

        {/* Credit Cards */}
        <Text style={s.sectionLabel}>{t.creditCard}</Text>
        {cards.map((card, i) => {
          const util = card.limit > 0 ? (card.balance / card.limit) * 100 : 0;
          const good = util < 30;
          return (
            <View key={i} style={[s.card, { borderLeftWidth: 3, borderLeftColor: good ? C.green : C.red }]}>
              <View style={s.cardRow}>
                <Text style={s.cardName}>💳  {card.name}</Text>
                <View style={[s.pill, { backgroundColor: good ? C.tintGr : '#FDE8E8' }]}>
                  <Text style={[s.pillText, { color: good ? C.green : C.red }]}>{Math.round(util)}% {t.used}</Text>
                </View>
              </View>
              <View style={s.trackWrap}>
                <View style={[s.trackFill, { width: `${Math.min(util, 100)}%`, backgroundColor: good ? C.green : C.red }]} />
              </View>
              <Text style={s.cardBalance}>${card.balance} {t.balance}</Text>
            </View>
          );
        })}

        <TouchableOpacity style={s.addCard} onPress={() => setModalVisible(true)} activeOpacity={0.7}>
          <Text style={s.addCardText}>{t.addCard}</Text>
        </TouchableOpacity>

        {/* Tip */}
        <View style={s.tip}>
          <Text style={s.tipIcon}>💡</Text>
          <View style={{ flex: 1 }}>
            <Text style={s.tipTitle}>{t.tipTitle}</Text>
            <Text style={s.tipBody}>{t.tipBody}</Text>
          </View>
        </View>

      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={s.overlay}>
          <View style={s.modalCard}>
            <Text style={s.modalTitle}>{t.modalTitle}</Text>
            <Divider />
            <TextInput style={s.input} placeholder={t.cardName} placeholderTextColor={C.text3} value={newCard.name} onChangeText={v => setNewCard(p => ({ ...p, name: v }))} />
            <TextInput style={s.input} placeholder={t.currentBalance} placeholderTextColor={C.text3} keyboardType="numeric" value={newCard.balance} onChangeText={v => setNewCard(p => ({ ...p, balance: v }))} />
            <TextInput style={s.input} placeholder={t.creditLimit} placeholderTextColor={C.text3} keyboardType="numeric" value={newCard.limit} onChangeText={v => setNewCard(p => ({ ...p, limit: v }))} />
            <View style={s.modalRow}>
              <TouchableOpacity style={s.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={s.cancelText}>{t.cancel}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.addBtn} onPress={addCard}>
                <Text style={s.addText}>{t.add}</Text>
              </TouchableOpacity>
            </View>
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
  sectionLabel: { fontSize: 12, color: C.text2, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginTop: 4, ...FF },
  card: {
    backgroundColor: C.card, borderRadius: 18, padding: 18, gap: 8,
    borderWidth: 1, borderColor: C.border,
    ...Platform.select({ ios: { shadowColor: C.navy, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 10 }, android: { elevation: 2 } }),
  },
  cardGold: { borderTopWidth: 3, borderTopColor: C.gold },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLabel: { fontSize: 11, color: C.text3, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: '700', ...FF },
  badge: { fontSize: 11, color: C.gold, fontWeight: '700', backgroundColor: C.tintG, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, ...FF },
  scoreValue: { fontSize: 48, fontWeight: '800', color: C.gold, letterSpacing: -1, ...FF },
  trackWrap: { width: '100%', height: 6, backgroundColor: C.tintN, borderRadius: 4, overflow: 'hidden' },
  trackFill: { height: '100%', backgroundColor: C.gold, borderRadius: 4 },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between' },
  scoreEdge: { fontSize: 12, color: C.text3 },
  scoreGoal: { fontSize: 12, color: C.blue, fontWeight: '600', ...FF },
  grid2: { flexDirection: 'row', gap: 12 },
  flex1: { flex: 1 },
  cardEmoji: { fontSize: 24, marginVertical: 2 },
  bigNum: { fontSize: 22, fontWeight: '800', color: C.text, ...FF },
  tapHint: { fontSize: 10, color: C.text3, letterSpacing: 0.5 },
  cardName: { fontSize: 15, fontWeight: '700', color: C.text, ...FF },
  cardBalance: { fontSize: 12, color: C.text2 },
  pill: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  pillText: { fontSize: 11, fontWeight: '700', ...FF },
  addCard: { borderWidth: 1.5, borderColor: C.border, borderStyle: 'dashed', borderRadius: 16, padding: 16, alignItems: 'center' },
  addCardText: { color: C.blue, fontSize: 14, fontWeight: '600', ...FF },
  tip: { backgroundColor: C.tintB, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.border, flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  tipIcon: { fontSize: 20, marginTop: 1 },
  tipTitle: { fontSize: 14, fontWeight: '700', color: C.navy, ...FF },
  tipBody: { fontSize: 13, color: C.text2, lineHeight: 19, marginTop: 2 },
  overlay: { flex: 1, backgroundColor: '#0E1E3D99', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: C.card, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, gap: 12, borderTopWidth: 3, borderColor: C.gold },
  modalTitle: { fontSize: 18, fontWeight: '800', color: C.text, ...FF },
  input: { backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 13, color: C.text, fontSize: 14 },
  modalRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  cancelBtn: { flex: 1, backgroundColor: C.bg, borderRadius: 50, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: C.border },
  cancelText: { color: C.text2, fontSize: 15, fontWeight: '700', ...FF },
  addBtn: { flex: 1, backgroundColor: C.navy, borderRadius: 50, paddingVertical: 14, alignItems: 'center' },
  addText: { color: '#fff', fontSize: 15, fontWeight: '700', ...FF },
});
