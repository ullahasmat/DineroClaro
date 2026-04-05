import { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Platform, Linking, TextInput, ActivityIndicator, Animated } from 'react-native';
import Constants from 'expo-constants';
import { useLocale, LifeStage } from '@/context/AppContext';

const FONT = Platform.OS === 'ios' ? 'Avenir Next' : undefined;
const FF = FONT ? { fontFamily: FONT } : {};

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
const fallbackApiBase = Platform.select({ ios: 'http://127.0.0.1:8000', android: 'http://10.0.2.2:8000', default: 'http://localhost:8000' });
const API_BASE = host ? `http://${host}:8000` : fallbackApiBase;

const C = {
  bg:     '#EEF3FB',
  card:   'rgba(255,255,255,0.95)',
  border: 'rgba(190,210,235,0.6)',
  navy:   '#162F5A',
  blue:   '#2B6CB0',
  gold:   '#E8A817',
  text:   '#0A1628',
  text2:  '#3D5575',
  text3:  '#7A95B4',
  green:  '#0E9A5E',
  tintN:  'rgba(230,238,252,0.9)',
  tintG:  'rgba(255,248,225,0.9)',
  tintB:  'rgba(228,240,255,0.9)',
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
      {
        section: 'Know Your Rights', emoji: '⚖️',
        items: [
          { id: '5', emoji: '🛡️', xp: 60, title: 'Your financial rights', duration: '4 min', body: 'Regardless of immigration status, you have financial rights in the U.S. Banks cannot refuse you service based on nationality. FDIC insures your deposits up to $250,000. Debt collectors cannot threaten deportation. You can file complaints with the CFPB.' },
          { id: '6', emoji: '🚨', xp: 50, title: 'Spotting scams & predatory loans', duration: '5 min', body: 'Watch for these red flags: "guaranteed approval" offers, upfront fees before a loan, pressure to sign immediately, check-cashing stores charging 3-5% fees, notarios claiming to be lawyers. Payday loans can charge 400%+ APR. Always compare with credit union alternatives.' },
        ],
      },
      {
        section: 'Family & Money', emoji: '👨‍👩‍👧‍👦',
        items: [
          { id: '7', emoji: '💬', xp: 50, title: 'Talking to family about money', duration: '4 min', body: 'Money talk is often taboo in Hispanic families, but it\'s essential for building wealth together. Start small: share one money win. Ask parents about their first job. Discuss remittance costs openly. Teach kids about saving with a clear jar — seeing money grow makes it real.' },
          { id: '8', emoji: '🌳', xp: 75, title: 'Building generational wealth', duration: '5 min', body: 'Breaking the cycle starts with small steps. Investing $50/month in an index fund for 30 years at 10% average return grows to over $100,000. Open a custodial account for your kids. Your sacrifice today creates opportunities they\'ll never have to worry about.' },
        ],
      },
      {
        section: 'Success Stories', emoji: '⭐',
        items: [
          { id: '9', emoji: '🏠', xp: 40, title: 'From zero credit to homeowner', duration: '3 min', body: 'Maria arrived from Mexico with no credit history. She got a secured card with a $200 deposit, paid it off monthly, became an authorized user on her sister\'s card. In 2 years her score went from nothing to 720. She bought her first home at 31 with an FHA loan — 3.5% down.' },
          { id: '10', emoji: '📈', xp: 40, title: 'First-gen investor success', duration: '3 min', body: 'Carlos was the first in his family to open a brokerage account. He started with $25/week into VOO. His parents thought investing was "for rich people." After 5 years, his portfolio hit $15,000. Now he helps his parents set up their retirement accounts.' },
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
      {
        section: 'Conoce Tus Derechos', emoji: '⚖️',
        items: [
          { id: '5', emoji: '🛡️', xp: 60, title: '¿Cuáles son tus derechos financieros?', duration: '4 min', body: 'Sin importar tu estatus migratorio, tienes derechos financieros en EE.UU. Los bancos no pueden negarte servicio por tu nacionalidad. La FDIC asegura tus depósitos hasta $250,000. Los cobradores de deudas no pueden amenazar con deportación. Puedes presentar quejas ante el CFPB.' },
          { id: '6', emoji: '🚨', xp: 50, title: 'Cómo detectar estafas y préstamos abusivos', duration: '5 min', body: 'Cuidado con estas señales: ofertas de "aprobación garantizada", cobros antes de dar un préstamo, presión para firmar de inmediato, casas de cambio de cheques que cobran 3-5%, notarios que dicen ser abogados. Los préstamos de día de pago pueden cobrar más de 400% APR. Siempre compara con cooperativas de crédito.' },
        ],
      },
      {
        section: 'Familia y Dinero', emoji: '👨‍👩‍👧‍👦',
        items: [
          { id: '7', emoji: '💬', xp: 50, title: 'Hablar de dinero con la familia', duration: '4 min', body: 'Hablar de dinero suele ser tabú en las familias hispanas, pero es esencial para construir riqueza juntos. Empieza poco a poco: comparte un logro financiero. Pregúntale a tus padres sobre su primer trabajo. Hablen abiertamente sobre los costos de las remesas. Enséñales a los niños a ahorrar con un frasco transparente — ver crecer el dinero lo hace real.' },
          { id: '8', emoji: '🌳', xp: 75, title: 'Construir riqueza generacional', duration: '5 min', body: 'Romper el ciclo empieza con pequeños pasos. Invertir $50/mes en un fondo indexado durante 30 años con un rendimiento promedio del 10% crece a más de $100,000. Abre una cuenta de custodia para tus hijos. Tu sacrificio de hoy crea oportunidades por las que ellos nunca tendrán que preocuparse.' },
        ],
      },
      {
        section: 'Historias de Éxito', emoji: '⭐',
        items: [
          { id: '9', emoji: '🏠', xp: 40, title: 'De cero crédito a dueño de casa', duration: '3 min', body: 'María llegó de México sin historial crediticio. Obtuvo una tarjeta asegurada con un depósito de $200, la pagó mensualmente y se convirtió en usuario autorizado de la tarjeta de su hermana. En 2 años su puntaje pasó de nada a 720. Compró su primera casa a los 31 con un préstamo FHA — 3.5% de enganche.' },
          { id: '10', emoji: '📈', xp: 40, title: 'Éxito de un inversionista primera generación', duration: '3 min', body: 'Carlos fue el primero en su familia en abrir una cuenta de inversión. Empezó con $25/semana en VOO. Sus padres pensaban que invertir era "para ricos." Después de 5 años, su portafolio llegó a $15,000. Ahora ayuda a sus padres a configurar sus cuentas de retiro.' },
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

const STATUS_COLOR: Record<Status, string> = { done: '#0E9A5E', 'in-progress': '#E8A817', 'not-started': '#7A95B4' };
const STATUS_BG: Record<Status, string> = { done: 'rgba(220,248,235,0.9)', 'in-progress': 'rgba(255,248,225,0.9)', 'not-started': 'rgba(230,238,252,0.9)' };
const INITIAL: Record<string, Status> = { '1': 'done', '2': 'in-progress', '3': 'not-started', '4': 'not-started', '5': 'not-started', '6': 'not-started', '7': 'not-started', '8': 'not-started', '9': 'not-started', '10': 'not-started' };

function FadeSlide({ index, scrollY, children }: { index: number; scrollY: Animated.Value; children: React.ReactNode }) {
  const offset = 100 + index * 120;
  const opacity = scrollY.interpolate({ inputRange: [offset - 300, offset - 200], outputRange: [0.6, 1], extrapolate: 'clamp' });
  const translateY = scrollY.interpolate({ inputRange: [offset - 300, offset - 200], outputRange: [12, 0], extrapolate: 'clamp' });
  return <Animated.View style={{ opacity, transform: [{ translateY }] }}>{children}</Animated.View>;
}

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

type ChatMsg = { role: 'user' | 'assistant'; text: string };

export default function LearnScreen() {
  const { locale, lifeStage } = useLocale();
  const t = T[locale];
  const scrollY = useRef(new Animated.Value(0)).current;
  let ci = 0;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<Record<string, Status>>(INITIAL);
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const allItems = t.sections.flatMap(sec => sec.items);
  const selected = selectedId ? allItems.find(i => i.id === selectedId) ?? null : null;

  function advance(id: string) {
    setStatuses(prev => {
      const cur = prev[id];
      return { ...prev, [id]: cur === 'not-started' ? 'in-progress' : 'done' };
    });
  }

  function openLesson(id: string) {
    setSelectedId(id);
    setChatMessages([]);
    setChatInput('');
  }

  async function askLana() {
    if (!chatInput.trim() || !selected) return;
    const question = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: question }]);
    setChatLoading(true);
    try {
      const systemCtx = locale === 'en'
        ? `The user is learning about "${selected.title}". Context: ${selected.body}. Answer their follow-up question clearly and concisely in English. Keep it 2-3 sentences max.`
        : `El usuario está aprendiendo sobre "${selected.title}". Contexto: ${selected.body}. Responde su pregunta de seguimiento de forma clara y concisa en español. Máximo 2-3 oraciones.`;
      const res = await fetch(`${API_BASE}/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `${systemCtx}\n\nUser question: ${question}`, locale, life_stage: lifeStage }),
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { role: 'assistant', text: data.reply ?? data.response ?? 'No response.' }]);
    } catch {
      setChatMessages(prev => [...prev, { role: 'assistant', text: locale === 'en' ? 'Could not reach Lana right now.' : 'No se pudo conectar con Lana.' }]);
    } finally {
      setChatLoading(false);
    }
  }

  const doneCount = Object.values(statuses).filter(s => s === 'done').length;
  const total = allItems.length;
  const xpTotal = doneCount * 50;
  const statusLabel: Record<Status, string> = { done: t.statusDone, 'in-progress': t.statusInProgress, 'not-started': t.statusNotStarted };

  return (
    <View style={s.root}>
      <Animated.ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
      >

        <View style={s.header}>
          <View>
            <Text style={s.eyebrow}>{t.eyebrow}</Text>
            <Text style={s.pageTitle}>{t.title}</Text>
          </View>
          <LangToggle />
        </View>

        {/* XP Card */}
        <FadeSlide index={ci++} scrollY={scrollY}>
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
        </FadeSlide>

        {t.sections.map((section) => (
          <View key={section.section}>
            <FadeSlide index={ci++} scrollY={scrollY}>
              <View style={s.sectionHeader}>
                <Text style={s.sectionEmoji}>{section.emoji}</Text>
                <Text style={s.sectionLabel}>{section.section}</Text>
                <View style={s.sectionLine} />
              </View>
            </FadeSlide>
            {section.items.map(lesson => {
              const status = statuses[lesson.id];
              const fillPct = status === 'done' ? 100 : status === 'in-progress' ? 50 : 0;
              return (
                <FadeSlide key={lesson.id} index={ci++} scrollY={scrollY}>
                  <TouchableOpacity
                    style={[s.lessonCard, { backgroundColor: STATUS_BG[status], borderLeftColor: STATUS_COLOR[status] }]}
                    onPress={() => openLesson(lesson.id)}
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
                </FadeSlide>
              );
            })}
          </View>
        ))}

        <FadeSlide index={ci++} scrollY={scrollY}>
          <View style={s.footerBadge}>
            <Text style={s.footerText}>{t.footer}</Text>
          </View>
        </FadeSlide>

        {/* Curated Resources */}
        <FadeSlide index={ci++} scrollY={scrollY}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionEmoji}>🔗</Text>
            <Text style={s.sectionLabel}>{t.resourcesLabel}</Text>
            <View style={s.sectionLine} />
          </View>
        </FadeSlide>
        <FadeSlide index={ci++} scrollY={scrollY}>
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
        </FadeSlide>
      </Animated.ScrollView>

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

                {/* AI Chat */}
                {chatMessages.length > 0 && (
                  <ScrollView style={s.chatScroll} showsVerticalScrollIndicator={false}>
                    {chatMessages.map((msg, i) => (
                      <View key={i} style={msg.role === 'user' ? s.chatUser : s.chatAssistant}>
                        <Text style={msg.role === 'user' ? s.chatUserText : s.chatAssistantText}>{msg.text}</Text>
                      </View>
                    ))}
                    {chatLoading && (
                      <View style={s.chatAssistant}>
                        <ActivityIndicator size="small" color={C.gold} />
                      </View>
                    )}
                  </ScrollView>
                )}

                <View style={s.chatInputRow}>
                  <TextInput
                    style={s.chatInput}
                    value={chatInput}
                    onChangeText={setChatInput}
                    placeholder={locale === 'en' ? 'Ask Lana a question...' : 'Pregúntale a Lana...'}
                    placeholderTextColor={C.text3}
                    onSubmitEditing={askLana}
                    returnKeyType="send"
                    editable={!chatLoading}
                  />
                  <TouchableOpacity style={[s.chatSendBtn, chatLoading && { opacity: 0.4 }]} onPress={askLana} disabled={chatLoading}>
                    <Text style={s.chatSendText}>▶</Text>
                  </TouchableOpacity>
                </View>

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
  wrap: { flexDirection: 'row', backgroundColor: 'rgba(235,240,250,0.85)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(200,216,235,0.7)', overflow: 'hidden' },
  btn: { paddingHorizontal: 12, paddingVertical: 6 },
  active: { backgroundColor: C.navy },
  divider: { width: 1, backgroundColor: C.border },
  text: { fontSize: 11, fontWeight: '700', color: C.text3, letterSpacing: 0.8, ...FF },
  activeText: { color: '#fff' },
});

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 56 : 40, paddingBottom: 110, gap: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 4 },
  eyebrow: { fontSize: 11, color: C.blue, fontWeight: '600', letterSpacing: 3, opacity: 0.7, ...FF },
  pageTitle: { fontSize: 34, fontWeight: '200', color: C.text, marginTop: 2, letterSpacing: -0.5, ...FF },
  xpCard: { backgroundColor: C.card, borderRadius: 24, padding: 18, borderWidth: 1, borderColor: C.border, borderTopWidth: 2, borderTopColor: C.gold, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', ...Platform.select({ ios: { shadowColor: C.navy, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 16 }, android: { elevation: 2 } }) },
  xpLabel: { fontSize: 10, color: C.blue, fontWeight: '700', letterSpacing: 1.5, ...FF },
  xpNum: { fontSize: 42, fontWeight: '200', color: C.gold, ...FF },
  xpUnit: { fontSize: 16, color: C.text2, fontWeight: '400' },
  xpSub: { fontSize: 12, color: C.text3, marginTop: 2 },
  levelBadge: { backgroundColor: C.navy, borderRadius: 50, paddingHorizontal: 14, paddingVertical: 4 },
  levelText: { color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 1, ...FF },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8, marginBottom: 10, backgroundColor: 'rgba(27,59,111,0.06)', borderRadius: 50, paddingHorizontal: 16, paddingVertical: 6, alignSelf: 'flex-start' },
  sectionEmoji: { fontSize: 15 },
  sectionLabel: { fontSize: 12, color: C.text2, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', ...FF },
  sectionLine: { flex: 1, height: 0, backgroundColor: C.border },
  lessonCard: { borderRadius: 20, padding: 14, borderWidth: 1, borderColor: C.border, borderLeftWidth: 4, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10, ...Platform.select({ ios: { shadowColor: C.navy, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 12 }, android: { elevation: 1 } }) },
  lessonIcon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  lessonTitle: { fontSize: 14, fontWeight: '700', color: C.text, ...FF },
  statusText: { fontSize: 11, fontWeight: '600' },
  barTrack: { width: '100%', height: 4, backgroundColor: C.border, borderRadius: 4, overflow: 'hidden', marginTop: 2 },
  barFill: { height: '100%', borderRadius: 4 },
  chevron: { fontSize: 22, color: C.text3, fontWeight: '300' },
  footerBadge: { alignSelf: 'center', borderWidth: 1.5, borderColor: C.gold, borderRadius: 50, paddingHorizontal: 22, paddingVertical: 9, marginTop: 4 },
  footerText: { color: C.gold, fontSize: 12, fontWeight: '800', letterSpacing: 2, ...FF },
  overlay: { flex: 1, backgroundColor: 'rgba(14,30,61,0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: C.card, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, gap: 14, borderTopWidth: 2, borderColor: C.gold },
  xpBadge: { alignSelf: 'flex-start', backgroundColor: C.tintG, borderRadius: 50, paddingHorizontal: 14, paddingVertical: 5, borderWidth: 1, borderColor: C.gold + '66' },
  xpBadgeText: { color: C.gold, fontSize: 13, fontWeight: '800', ...FF },
  modalBody: { fontSize: 14, color: C.text2, lineHeight: 22 },
  cancelBtn: { flex: 1, backgroundColor: C.bg, borderRadius: 50, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: C.border },
  cancelText: { color: C.text2, fontSize: 14, fontWeight: '700', ...FF },
  primaryBtn: { flex: 1, backgroundColor: C.navy, borderRadius: 50, paddingVertical: 14, alignItems: 'center' },
  primaryText: { color: '#fff', fontSize: 14, fontWeight: '700', ...FF },
  resourcesCard: { backgroundColor: C.card, borderRadius: 22, borderWidth: 1, borderColor: C.border, overflow: 'hidden', paddingHorizontal: 18, paddingTop: 14, paddingBottom: 4, ...Platform.select({ ios: { shadowColor: C.navy, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 16 }, android: { elevation: 2 } }) },
  resourcesTitle: { fontSize: 17, fontWeight: '800', color: C.text, ...FF },
  resourcesSub: { fontSize: 11, color: C.text3, marginTop: 2, marginBottom: 12 },
  resourceRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  resourceBorder: { borderBottomWidth: 1, borderBottomColor: C.border },
  resourceIconBox: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  resourceTitle: { fontSize: 13, fontWeight: '700', color: C.text, flexShrink: 1, ...FF },
  typeBadge: { borderRadius: 50, paddingHorizontal: 8, paddingVertical: 2 },
  typeText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.8 },
  resourceDesc: { fontSize: 11, color: C.text3, lineHeight: 16 },
  resourceBtn: { fontSize: 12, fontWeight: '700', flexShrink: 0, ...FF },
  chatScroll: { maxHeight: 200, marginTop: 4 },
  chatUser: { alignSelf: 'flex-end', backgroundColor: C.navy, borderRadius: 16, borderBottomRightRadius: 4, padding: 10, maxWidth: '80%', marginBottom: 6 },
  chatUserText: { color: '#fff', fontSize: 13, lineHeight: 19 },
  chatAssistant: { alignSelf: 'flex-start', backgroundColor: C.tintN, borderRadius: 16, borderBottomLeftRadius: 4, padding: 10, maxWidth: '80%', marginBottom: 6 },
  chatAssistantText: { color: C.text, fontSize: 13, lineHeight: 19 },
  chatInputRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 6 },
  chatInput: { flex: 1, backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, borderRadius: 50, paddingHorizontal: 16, paddingVertical: 10, color: C.text, fontSize: 13, ...FF },
  chatSendBtn: { width: 38, height: 38, backgroundColor: C.navy, borderRadius: 50, alignItems: 'center', justifyContent: 'center' },
  chatSendText: { color: '#fff', fontSize: 12, fontWeight: '800' },
});
