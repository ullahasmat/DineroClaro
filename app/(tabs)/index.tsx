import { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity,
  TextInput, Modal, StyleSheet, Platform,
  ActivityIndicator, Animated, LayoutAnimation, UIManager,
} from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
import Constants from 'expo-constants';
import { useLocale } from '@/context/AppContext';

const FONT = Platform.OS === 'ios' ? 'Avenir Next' : undefined;
const FF = FONT ? { fontFamily: FONT } : {};

/* ── API base (same pattern as chat.tsx) ── */
const runtime = Constants as unknown as {
  expoConfig?: { hostUri?: string };
  expoGoConfig?: { debuggerHost?: string };
  manifest?: { debuggerHost?: string };
  manifest2?: { extra?: { expoClient?: { hostUri?: string } } };
};
const hostUri =
  runtime.expoGoConfig?.debuggerHost ??
  runtime.manifest?.debuggerHost ??
  runtime.expoConfig?.hostUri ??
  runtime.manifest2?.extra?.expoClient?.hostUri;
const host = hostUri?.split(':')[0];
const fallbackApiBase = Platform.select({
  ios: 'http://127.0.0.1:8000',
  android: 'http://10.0.2.2:8000',
  default: 'http://localhost:8000',
});
const API_BASE = host ? `http://${host}:8000` : fallbackApiBase;

/* ── Vibrant palette ── */
const C = {
  bg:        '#EEF3FB',
  card:      'rgba(255,255,255,0.95)',
  cardSolid: '#FFFFFF',
  glass:     'rgba(255,255,255,0.85)',
  border:    'rgba(190,210,235,0.6)',
  navy:      '#162F5A',
  blue:      '#2B6CB0',
  gold:      '#E8A817',
  text:      '#0A1628',
  text2:     '#3D5575',
  text3:     '#7A95B4',
  green:     '#0E9A5E',
  red:       '#E04040',
  tintN:     'rgba(230,238,252,0.9)',
  tintG:     'rgba(255,248,225,0.9)',
  tintB:     'rgba(228,240,255,0.9)',
  tintGr:    'rgba(220,248,235,0.9)',
  hero:      'rgba(22,47,90,0.05)',
};

/* ── Translations ── */
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
    trendingLabel: 'TRENDING FOR LONG-TERM',
    trendingSub: 'Popular picks among long-term investors',
    creditPrompt: 'Your credit score (300-850):',
    insightTitle: "Lana's Insights",
    insightLoading: 'Generating insights...',
    dailyTipLabel: 'DAILY TIP',
    streakLabel: 'day streak',
    streakMsg: 'You\'re building great habits!',
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
    trendingLabel: 'TENDENCIAS A LARGO PLAZO',
    trendingSub: 'Opciones populares entre inversionistas a largo plazo',
    creditPrompt: 'Tu puntaje de crédito (300-850):',
    insightTitle: 'Consejos de Lana',
    insightLoading: 'Generando consejos...',
    dailyTipLabel: 'TIP DEL DÍA',
    streakLabel: 'días seguidos',
    streakMsg: '¡Estás creando grandes hábitos!',
  },
};

type Card = { name: string; balance: number; limit: number };
const DEFAULT_CARDS: Card[] = [{ name: 'Discover Secured', balance: 110, limit: 500 }];

const DAILY_TIPS = {
  en: [
    { emoji: '💳', tip: 'Paying your credit card before the statement date lowers your reported utilization — boosting your score.' },
    { emoji: '🏦', tip: 'You can open a bank account with an ITIN — no Social Security Number needed at many credit unions.' },
    { emoji: '💸', tip: 'Wise and Remitly often charge 50-70% less than Western Union for sending money to Latin America.' },
    { emoji: '📊', tip: '$50/month invested in VOO for 30 years at 10% average return grows to over $100,000.' },
    { emoji: '🛡️', tip: 'Your bank deposits are protected by FDIC up to $250,000 — regardless of immigration status.' },
    { emoji: '🚨', tip: 'A "notario" in the U.S. is NOT a lawyer. Never pay a notario for legal or immigration advice.' },
    { emoji: '👨‍👩‍👧', tip: 'Talk to your kids about money early. A clear savings jar makes watching money grow fun and real.' },
    { emoji: '📄', tip: 'You can get your credit report for free once a year at AnnualCreditReport.com — no credit card needed.' },
    { emoji: '🏠', tip: 'FHA loans let you buy a home with just 3.5% down. Ask Lana about first-time buyer programs.' },
    { emoji: '⚖️', tip: 'Debt collectors cannot threaten you with deportation. That\'s illegal under the FDCPA.' },
  ],
  es: [
    { emoji: '💳', tip: 'Pagar tu tarjeta antes de la fecha de corte reduce tu utilización reportada — mejorando tu puntaje.' },
    { emoji: '🏦', tip: 'Puedes abrir una cuenta bancaria con ITIN — no necesitas número de seguro social en muchas cooperativas.' },
    { emoji: '💸', tip: 'Wise y Remitly suelen cobrar 50-70% menos que Western Union para enviar dinero a Latinoamérica.' },
    { emoji: '📊', tip: '$50/mes invertidos en VOO por 30 años con 10% de retorno promedio crecen a más de $100,000.' },
    { emoji: '🛡️', tip: 'Tus depósitos bancarios están protegidos por FDIC hasta $250,000 — sin importar tu estatus migratorio.' },
    { emoji: '🚨', tip: 'Un "notario" en EE.UU. NO es abogado. Nunca pagues a un notario por consejos legales o de inmigración.' },
    { emoji: '👨‍👩‍👧', tip: 'Habla con tus hijos sobre el dinero desde temprano. Un frasco transparente hace que ahorrar sea divertido.' },
    { emoji: '📄', tip: 'Puedes obtener tu reporte de crédito gratis una vez al año en AnnualCreditReport.com — sin tarjeta.' },
    { emoji: '🏠', tip: 'Los préstamos FHA te permiten comprar casa con solo 3.5% de enganche. Pregúntale a Lana.' },
    { emoji: '⚖️', tip: 'Los cobradores de deudas NO pueden amenazarte con deportación. Eso es ilegal bajo la ley FDCPA.' },
  ],
};

const TRENDING = {
  en: [
    { ticker: 'VOO', name: 'Vanguard S&P 500 ETF', change: '+24.5%', flag: '🇺🇸', desc: 'Top 500 U.S. companies in one fund.', howTo: 'Open a brokerage account (Fidelity, Schwab, or Robinhood), search "VOO", and buy shares. Start with as little as $1 using fractional shares. Set up automatic monthly investments.' },
    { ticker: 'QQQ', name: 'Invesco Nasdaq 100', change: '+31.2%', flag: '💻', desc: 'Tech-heavy growth: Apple, Microsoft, Nvidia & more.', howTo: 'Available on any brokerage app. Search "QQQ" and buy. Great for long-term growth. Consider dollar-cost averaging — invest the same amount every month regardless of price.' },
    { ticker: 'SCHD', name: 'Schwab Dividend Equity', change: '+12.8%', flag: '💰', desc: 'Steady dividends + price growth.', howTo: 'Buy through Schwab or any major broker. SCHD pays quarterly dividends you can reinvest automatically (DRIP). Ideal for building passive income over time.' },
  ],
  es: [
    { ticker: 'VOO', name: 'Vanguard S&P 500 ETF', change: '+24.5%', flag: '🇺🇸', desc: 'Las 500 principales empresas de EE.UU. en un fondo.', howTo: 'Abre una cuenta en un broker (Fidelity, Schwab o Robinhood), busca "VOO" y compra acciones. Puedes empezar desde $1 con acciones fraccionadas. Configura inversiones mensuales automáticas.' },
    { ticker: 'QQQ', name: 'Invesco Nasdaq 100', change: '+31.2%', flag: '💻', desc: 'Crecimiento tecnológico: Apple, Microsoft, Nvidia y más.', howTo: 'Disponible en cualquier app de inversión. Busca "QQQ" y compra. Ideal para crecimiento a largo plazo. Considera invertir la misma cantidad cada mes sin importar el precio.' },
    { ticker: 'SCHD', name: 'Schwab Dividend Equity', change: '+12.8%', flag: '💰', desc: 'Dividendos estables + crecimiento.', howTo: 'Compra a través de Schwab o cualquier broker. SCHD paga dividendos trimestrales que puedes reinvertir automáticamente (DRIP). Ideal para generar ingresos pasivos con el tiempo.' },
  ],
};

/* ── Animated wrapper ── */
function FadeSlide({ index, scrollY, children }: { index: number; scrollY: Animated.Value; children: React.ReactNode }) {
  const offset = 100 + index * 120;
  const opacity = scrollY.interpolate({ inputRange: [offset - 300, offset - 200], outputRange: [0.6, 1], extrapolate: 'clamp' });
  const translateY = scrollY.interpolate({ inputRange: [offset - 300, offset - 200], outputRange: [12, 0], extrapolate: 'clamp' });
  return <Animated.View style={{ opacity, transform: [{ translateY }] }}>{children}</Animated.View>;
}

/* ── Glass label ── */
function GlassLabel({ text }: { text: string }) {
  return (
    <View style={s.glassLabel}>
      <Text style={s.glassLabelText}>{text}</Text>
    </View>
  );
}

/* ── Language toggle ── */
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

/* ══════════════════════════════════════════════════════ */
/*  MAIN SCREEN                                          */
/* ══════════════════════════════════════════════════════ */
export default function FinancesScreen() {
  const { locale, lifeStage, userProfile, financialProfile, setFinancialProfile } = useLocale();
  const t = T[locale];

  const scrollY = useRef(new Animated.Value(0)).current;

  const [income, setIncomeLocal] = useState(() => parseFloat(financialProfile.income) || 2400);
  const [checking, setCheckingLocal] = useState(() => parseFloat(financialProfile.checking) || 1240);
  const [creditScore, setCreditScoreLocal] = useState(() => parseFloat(financialProfile.creditScore) || 642);
  const [dataVersion, setDataVersion] = useState(0);

  function setIncome(v: number) { setIncomeLocal(v); setDataVersion(n => n + 1); }
  function setChecking(v: number) { setCheckingLocal(v); setDataVersion(n => n + 1); }
  function setCreditScore(v: number) { setCreditScoreLocal(v); setDataVersion(n => n + 1); }
  const [cards, setCards] = useState<Card[]>(() =>
    financialProfile.cards.length > 0
      ? financialProfile.cards.map(c => ({ name: c.name, balance: parseFloat(c.balance) || 0, limit: parseFloat(c.limit) || 0 }))
      : DEFAULT_CARDS
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [newCard, setNewCard] = useState({ name: '', balance: '', limit: '' });

  const [insight, setInsight] = useState<string | null>(null);
  const [insightLoading, setInsightLoading] = useState(false);
  const [insightOpen, setInsightOpen] = useState(false);

  function toggleInsight() {
    LayoutAnimation.configureNext(LayoutAnimation.create(250, 'easeInEaseOut', 'opacity'));
    setInsightOpen(prev => !prev);
  }

  const dayIndex = Math.floor(Date.now() / 86400000) % DAILY_TIPS.en.length;

  // Streak: count days since first use, stored as epoch day in context area field hack
  const [streak, setStreak] = useState(() => {
    try {
      const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('dc_streak') : null;
      if (!stored) return 0;
      const { start, last } = JSON.parse(stored);
      const today = Math.floor(Date.now() / 86400000);
      if (today - last > 1) return 0; // streak broken
      return today - start;
    } catch { return 0; }
  });

  useEffect(() => {
    try {
      if (typeof localStorage === 'undefined') return;
      const today = Math.floor(Date.now() / 86400000);
      const stored = localStorage.getItem('dc_streak');
      if (!stored) {
        localStorage.setItem('dc_streak', JSON.stringify({ start: today, last: today }));
        setStreak(0);
      } else {
        const { start, last } = JSON.parse(stored);
        if (today - last > 1) {
          localStorage.setItem('dc_streak', JSON.stringify({ start: today, last: today }));
          setStreak(0);
        } else if (today !== last) {
          localStorage.setItem('dc_streak', JSON.stringify({ start, last: today }));
          setStreak(today - start);
        }
      }
    } catch { /* non-web fallback */ }
  }, []);

  const scoreGoal = 850;
  const scoreMin = 300;
  const scorePct = ((creditScore - scoreMin) / (scoreGoal - scoreMin)) * 100;

  function getScoreRating() {
    if (creditScore >= 750) return { label: locale === 'en' ? 'Excellent' : 'Excelente', emoji: '🌟', color: C.green };
    if (creditScore >= 700) return { label: locale === 'en' ? 'Good' : 'Bueno', emoji: '✅', color: C.green };
    if (creditScore >= 650) return { label: locale === 'en' ? 'Fair' : 'Regular', emoji: '⭐', color: C.gold };
    if (creditScore >= 550) return { label: locale === 'en' ? 'Poor' : 'Bajo', emoji: '⚠️', color: C.red };
    return { label: locale === 'en' ? 'Very Poor' : 'Muy bajo', emoji: '🚨', color: C.red };
  }
  const rating = getScoreRating();

  /* ── Fetch Claude insights ── */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setInsightLoading(true);
      setInsight(null);
      const hasCards = cards.length > 0 && cards[0].name !== 'Discover Secured';
      const cardInfo = hasCards
        ? (locale === 'es'
          ? `Tarjetas: ${cards.map(c => `${c.name} ($${c.balance}/$${c.limit})`).join(', ')}`
          : `Cards: ${cards.map(c => `${c.name} ($${c.balance}/$${c.limit})`).join(', ')}`)
        : (locale === 'es'
          ? 'El usuario NO tiene tarjetas de crédito. Sugiere tarjetas de crédito específicas para principiantes según su edad y área (secured cards como Discover it Secured, Capital One Platinum Secured, o Chime Credit Builder). Explica por qué cada una es buena para ellos.'
          : 'The user has NO credit cards. Suggest specific beginner-friendly credit cards based on their age and area (secured cards like Discover it Secured, Capital One Platinum Secured, or Chime Credit Builder). Explain why each is good for them.');

      const prompt = locale === 'es'
        ? `Eres Lana, asesora financiera de DineroClaro. Da 3-4 puntos breves de consejos financieros personalizados en español basados en estos datos: Nombre: ${userProfile.name || 'Usuario'}, Edad: ${userProfile.age || 'N/A'}, Área: ${userProfile.area || 'N/A'}, Etapa: ${lifeStage}, Puntaje de crédito: ${creditScore}, Ingreso: $${income}, Cuenta: $${checking}. ${cardInfo}. Responde SOLO con los puntos, sin saludo ni cierre.`
        : `You are Lana, DineroClaro's financial advisor. Give 3-4 brief personalized financial advice bullet points in English based on this data: Name: ${userProfile.name || 'User'}, Age: ${userProfile.age || 'N/A'}, Area: ${userProfile.area || 'N/A'}, Stage: ${lifeStage}, Credit score: ${creditScore}, Income: $${income}, Checking: $${checking}. ${cardInfo}. Respond ONLY with the bullet points, no greeting or sign-off.`;
      try {
        const res = await fetch(`${API_BASE}/chat/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: prompt }),
        });
        const data = await res.json();
        if (!cancelled) setInsight(data.reply ?? data.response ?? JSON.stringify(data));
      } catch {
        if (!cancelled) setInsight(locale === 'es' ? 'No se pudo conectar al servidor.' : 'Could not connect to the server.');
      } finally {
        if (!cancelled) setInsightLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [locale, dataVersion]);

  /* ── Parallax header interpolations ── */
  const headerScale = scrollY.interpolate({ inputRange: [-80, 0], outputRange: [1.05, 1], extrapolate: 'clamp' });
  const headerOpacity = scrollY.interpolate({ inputRange: [0, 300], outputRange: [1, 0.85], extrapolate: 'clamp' });
  const heroTranslate = scrollY.interpolate({ inputRange: [0, 200], outputRange: [0, -20], extrapolate: 'clamp' });

  function syncFinancials(opts?: { updatedCards?: Card[]; score?: number; inc?: number; chk?: number }) {
    const c = opts?.updatedCards ?? cards;
    setFinancialProfile({
      creditScore: String(opts?.score ?? creditScore),
      income: String(opts?.inc ?? income),
      checking: String(opts?.chk ?? checking),
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
    syncFinancials({ updatedCards: updated });
  }

  let ci = 0;

  return (
    <View style={s.root}>
      <Animated.ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
      >

        {/* ── Hero header ── */}
        <Animated.View style={[s.heroWrap, { opacity: headerOpacity, transform: [{ scale: headerScale }, { translateY: heroTranslate }] }]}>
          <View style={s.heroBubble1} />
          <View style={s.heroBubble2} />
          <View style={s.heroBubble3} />
          <View style={s.header}>
            <View>
              <Text style={s.eyebrow}>{t.eyebrow}</Text>
              <Text style={s.pageTitle}>{t.title}</Text>
            </View>
            <LangToggle />
          </View>
        </Animated.View>

        {/* ── Lana's Insights (collapsible) ── */}
        <FadeSlide index={ci++} scrollY={scrollY}>
          <TouchableOpacity style={s.insightCard} onPress={toggleInsight} activeOpacity={0.85}>
            <View style={s.insightHeader}>
              <View style={s.insightAvatar}>
                <Text style={s.insightAvatarText}>L</Text>
              </View>
              <Text style={s.insightTitle}>{t.insightTitle}</Text>
              <View style={{ flex: 1 }} />
              {insightLoading ? (
                <ActivityIndicator size="small" color={C.gold} />
              ) : (
                <Text style={s.insightChevron}>{insightOpen ? '▲' : '▼'}</Text>
              )}
            </View>
            {insightOpen && !insightLoading && (
              <Text style={s.insightBody}>{insight}</Text>
            )}
          </TouchableOpacity>
        </FadeSlide>

        {/* ── Daily Tip + Streak ── */}
        <FadeSlide index={ci++} scrollY={scrollY}>
          <View style={s.dailyRow}>
            <View style={s.dailyTipCard}>
              <Text style={s.dailyLabel}>{t.dailyTipLabel}</Text>
              <Text style={s.dailyEmoji}>{DAILY_TIPS[locale][dayIndex].emoji}</Text>
              <Text style={s.dailyText}>{DAILY_TIPS[locale][dayIndex].tip}</Text>
            </View>
            <View style={s.streakCard}>
              <Text style={s.streakNum}>{streak}</Text>
              <Text style={s.streakUnit}>{t.streakLabel}</Text>
              <Text style={s.streakFire}>🔥</Text>
            </View>
          </View>
        </FadeSlide>

        {/* ── Credit Score ── */}
        <FadeSlide index={ci++} scrollY={scrollY}>
          <GlassLabel text={t.creditScore} />
          <TouchableOpacity style={[s.card, s.cardGold]} onPress={() => {
            const v = prompt(t.creditPrompt, String(creditScore));
            if (v) { const n = Math.max(300, Math.min(850, parseInt(v) || creditScore)); setCreditScore(n); syncFinancials({ score: n }); }
          }} activeOpacity={0.75}>
            <View style={s.cardRow}>
              <Text style={s.cardLabel}>{t.creditScore}</Text>
              <View style={[s.badge, { backgroundColor: rating.color + '18' }]}>
                <Text style={[s.badgeText, { color: rating.color }]}>{rating.emoji} {rating.label}</Text>
              </View>
            </View>
            <Text style={[s.scoreValue, { color: rating.color }]}>{creditScore}</Text>
            <View style={s.trackWrap}>
              <View style={[s.trackFill, { width: `${Math.min(scorePct, 100)}%`, backgroundColor: rating.color }]} />
            </View>
            <View style={s.scoreRow}>
              <Text style={s.scoreEdge}>{scoreMin}</Text>
              <Text style={s.tapHint}>{t.tapEdit}</Text>
              <Text style={s.scoreGoal}>{t.goal}: {scoreGoal}</Text>
            </View>
          </TouchableOpacity>
        </FadeSlide>

        {/* ── Income + Checking ── */}
        <FadeSlide index={ci++} scrollY={scrollY}>
          <View style={s.grid2}>
            <TouchableOpacity style={[s.card, s.flex1]} onPress={() => { const v = prompt(t.incomePrompt, String(income)); if (v) { const n = parseFloat(v) || income; setIncome(n); syncFinancials({ inc: n }); } }} activeOpacity={0.75}>
              <Text style={s.cardLabel}>{t.income}</Text>
              <Text style={s.cardEmoji}>{'\uD83D\uDCB5'}</Text>
              <Text style={s.bigNum}>${income.toLocaleString()}</Text>
              <Text style={s.tapHint}>{t.tapEdit}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.card, s.flex1]} onPress={() => { const v = prompt(t.checkingPrompt, String(checking)); if (v) { const n = parseFloat(v) || checking; setChecking(n); syncFinancials({ chk: n }); } }} activeOpacity={0.75}>
              <Text style={s.cardLabel}>{t.checking}</Text>
              <Text style={s.cardEmoji}>{'\uD83C\uDFE6'}</Text>
              <Text style={s.bigNum}>${checking.toLocaleString()}</Text>
              <Text style={s.tapHint}>{t.tapEdit}</Text>
            </TouchableOpacity>
          </View>
        </FadeSlide>

        {/* ── Credit Cards ── */}
        <FadeSlide index={ci++} scrollY={scrollY}>
          <GlassLabel text={t.creditCard} />
        </FadeSlide>

        {cards.map((card, i) => {
          const util = card.limit > 0 ? (card.balance / card.limit) * 100 : 0;
          const good = util < 30;
          return (
            <FadeSlide key={i} index={ci++} scrollY={scrollY}>
              <View style={[s.card, { borderLeftWidth: 3, borderLeftColor: good ? C.green : C.red }]}>
                <View style={s.cardRow}>
                  <Text style={s.cardName}>{'\uD83D\uDCB3'}  {card.name}</Text>
                  <View style={[s.pill, { backgroundColor: good ? C.tintGr : 'rgba(253,232,232,0.7)' }]}>
                    <Text style={[s.pillText, { color: good ? C.green : C.red }]}>{Math.round(util)}% {t.used}</Text>
                  </View>
                </View>
                <View style={s.trackWrap}>
                  <View style={[s.trackFill, { width: `${Math.min(util, 100)}%`, backgroundColor: good ? C.green : C.red }]} />
                </View>
                <Text style={s.cardBalance}>${card.balance} {t.balance}</Text>
              </View>
            </FadeSlide>
          );
        })}

        <FadeSlide index={ci++} scrollY={scrollY}>
          <TouchableOpacity style={s.addCard} onPress={() => setModalVisible(true)} activeOpacity={0.7}>
            <Text style={s.addCardText}>{t.addCard}</Text>
          </TouchableOpacity>
        </FadeSlide>

        {/* ── Trending Stocks ── */}
        <FadeSlide index={ci++} scrollY={scrollY}>
          <GlassLabel text={t.trendingLabel} />
          <Text style={s.trendingSub}>{t.trendingSub}</Text>
        </FadeSlide>
        {TRENDING[locale].map((stock, i) => (
          <FadeSlide key={stock.ticker} index={ci++} scrollY={scrollY}>
            <View style={s.stockCard}>
              <View style={s.stockRow}>
                <View style={s.stockLeft}>
                  <Text style={s.stockFlag}>{stock.flag}</Text>
                  <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={s.stockTicker}>{stock.ticker}</Text>
                      <View style={s.stockChangePill}>
                        <Text style={s.stockChangeText}>{stock.change} 1Y</Text>
                      </View>
                    </View>
                    <Text style={s.stockName}>{stock.name}</Text>
                  </View>
                </View>
              </View>
              <Text style={s.stockDesc}>{stock.desc}</Text>
              <View style={s.stockHowTo}>
                <Text style={s.stockHowToLabel}>{locale === 'en' ? '📖 How to invest' : '📖 Cómo invertir'}</Text>
                <Text style={s.stockHowToText}>{stock.howTo}</Text>
              </View>
            </View>
          </FadeSlide>
        ))}

        {/* ── Tip ── */}
        <FadeSlide index={ci++} scrollY={scrollY}>
          <View style={s.tip}>
            <Text style={s.tipIcon}>{'\uD83D\uDCA1'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.tipTitle}>{t.tipTitle}</Text>
              <Text style={s.tipBody}>{t.tipBody}</Text>
            </View>
          </View>
        </FadeSlide>

      </Animated.ScrollView>

      {/* ── Modal ── */}
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

/* ── Language toggle styles ── */
const lt = StyleSheet.create({
  wrap: { flexDirection: 'row', backgroundColor: C.tintN, borderRadius: 20, borderWidth: 1, borderColor: C.border, overflow: 'hidden' },
  btn: { paddingHorizontal: 12, paddingVertical: 6 },
  active: { backgroundColor: C.navy },
  divider: { width: 1, backgroundColor: C.border },
  text: { fontSize: 11, fontWeight: '700', color: C.text3, letterSpacing: 0.8, ...FF },
  activeText: { color: '#fff' },
});

/* ── Main styles ── */
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 56 : 40, paddingBottom: 104, gap: 14 },

  /* Hero */
  heroWrap: {
    backgroundColor: C.hero,
    borderRadius: 24,
    padding: 20,
    marginBottom: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  heroBubble1: {
    position: 'absolute', top: -30, right: -30,
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(59,115,185,0.07)',
  },
  heroBubble2: {
    position: 'absolute', bottom: -20, left: 20,
    width: 70, height: 70, borderRadius: 35,
    backgroundColor: 'rgba(196,153,26,0.06)',
  },
  heroBubble3: {
    position: 'absolute', top: 10, left: -15,
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: 'rgba(26,122,86,0.05)',
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  eyebrow: { fontSize: 11, color: C.blue, fontWeight: '600', letterSpacing: 3, opacity: 0.7, ...FF },
  pageTitle: { fontSize: 34, fontWeight: '200', color: C.text, marginTop: 2, letterSpacing: -0.5, ...FF },

  /* Glass label */
  glassLabel: {
    backgroundColor: 'rgba(27,59,111,0.06)',
    borderRadius: 50,
    paddingHorizontal: 14,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
    marginTop: 4,
  },
  glassLabelText: {
    fontSize: 11, color: C.text2, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', ...FF,
  },

  /* Insight card */
  insightCard: {
    backgroundColor: C.card,
    borderRadius: 22,
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: C.border,
    borderLeftWidth: 4,
    borderLeftColor: C.gold,
    ...Platform.select({
      ios: { shadowColor: C.navy, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 16 },
      android: { elevation: 3 },
    }),
  },
  insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  insightAvatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: C.glass,
    borderWidth: 2, borderColor: C.gold,
    alignItems: 'center', justifyContent: 'center',
  },
  insightAvatarText: { fontSize: 16, fontWeight: '700', color: C.gold, ...FF },
  insightTitle: { fontSize: 16, fontWeight: '700', color: C.text, ...FF },
  insightLoading: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 },
  insightLoadingText: { fontSize: 13, color: C.text3, ...FF },
  insightChevron: { fontSize: 12, color: C.text3 },
  insightBody: { fontSize: 14, color: C.text2, lineHeight: 21, ...FF },

  /* Cards */
  card: {
    backgroundColor: C.card, borderRadius: 22, padding: 18, gap: 8,
    borderWidth: 1, borderColor: C.border,
    ...Platform.select({
      ios: { shadowColor: C.navy, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 16 },
      android: { elevation: 2 },
    }),
  },
  cardGold: { borderTopWidth: 3, borderTopColor: C.gold, borderRadius: 24 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLabel: { fontSize: 11, color: C.text3, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: '700', ...FF },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: '700', ...FF },
  scoreValue: { fontSize: 56, fontWeight: '200', color: C.gold, letterSpacing: -1, ...FF },
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
  addCard: {
    borderWidth: 1.5, borderColor: C.border, borderStyle: 'dashed', borderRadius: 22,
    padding: 16, alignItems: 'center', backgroundColor: C.glass,
  },
  addCardText: { color: C.blue, fontSize: 14, fontWeight: '600', ...FF },

  /* Trending stocks */
  trendingSub: { fontSize: 13, color: C.text3, marginBottom: 4, marginTop: -2, ...FF },
  stockCard: {
    backgroundColor: C.card, borderRadius: 22, padding: 18, gap: 10,
    borderWidth: 1, borderColor: C.border,
    ...Platform.select({
      ios: { shadowColor: C.navy, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 16 },
      android: { elevation: 2 },
    }),
  },
  stockRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stockLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stockFlag: { fontSize: 26 },
  stockTicker: { fontSize: 17, fontWeight: '800', color: C.navy, letterSpacing: 0.5, ...FF },
  stockName: { fontSize: 13, color: C.text2, marginTop: 1, ...FF },
  stockChangePill: { backgroundColor: C.tintGr, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  stockChangeText: { fontSize: 11, fontWeight: '800', color: C.green, ...FF },
  stockDesc: { fontSize: 13, color: C.text2, lineHeight: 19, ...FF },
  stockHowTo: { backgroundColor: C.tintB, borderRadius: 14, padding: 14, gap: 4 },
  stockHowToLabel: { fontSize: 12, fontWeight: '700', color: C.navy, ...FF },
  stockHowToText: { fontSize: 13, color: C.text2, lineHeight: 20, ...FF },

  /* Daily tip + streak */
  dailyRow: { flexDirection: 'row', gap: 12 },
  dailyTipCard: {
    flex: 3, backgroundColor: C.card, borderRadius: 22, padding: 16, gap: 8,
    borderWidth: 1, borderColor: C.border, borderLeftWidth: 3, borderLeftColor: C.blue,
    ...Platform.select({ ios: { shadowColor: C.navy, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 12 }, android: { elevation: 2 } }),
  },
  dailyLabel: { fontSize: 10, fontWeight: '700', color: C.blue, letterSpacing: 1.5, ...FF },
  dailyEmoji: { fontSize: 24 },
  dailyText: { fontSize: 13, color: C.text2, lineHeight: 19, ...FF },
  streakCard: {
    flex: 1, backgroundColor: C.tintG, borderRadius: 22, padding: 14, gap: 2,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(232,168,23,0.2)',
    ...Platform.select({ ios: { shadowColor: C.gold, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 10 }, android: { elevation: 2 } }),
  },
  streakNum: { fontSize: 32, fontWeight: '800', color: C.gold, ...FF },
  streakUnit: { fontSize: 10, fontWeight: '600', color: C.gold, textAlign: 'center', ...FF },
  streakFire: { fontSize: 20, marginTop: 2 },

  /* Tip */
  tip: {
    backgroundColor: C.tintB, borderRadius: 22, padding: 18,
    borderWidth: 1, borderColor: C.border,
    flexDirection: 'row', gap: 12, alignItems: 'flex-start',
  },
  tipIcon: { fontSize: 20, marginTop: 1 },
  tipTitle: { fontSize: 14, fontWeight: '700', color: C.navy, ...FF },
  tipBody: { fontSize: 13, color: C.text2, lineHeight: 19, marginTop: 2 },

  /* Modal */
  overlay: { flex: 1, backgroundColor: 'rgba(14,30,61,0.5)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: C.cardSolid, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 24, gap: 12, borderTopWidth: 3, borderColor: C.gold,
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: C.text, ...FF },
  input: {
    backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 13, color: C.text, fontSize: 14,
  },
  modalRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  cancelBtn: { flex: 1, backgroundColor: C.bg, borderRadius: 50, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: C.border },
  cancelText: { color: C.text2, fontSize: 15, fontWeight: '700', ...FF },
  addBtn: { flex: 1, backgroundColor: C.navy, borderRadius: 50, paddingVertical: 14, alignItems: 'center' },
  addText: { color: '#fff', fontSize: 15, fontWeight: '700', ...FF },
});
