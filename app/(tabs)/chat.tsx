import { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import Constants from 'expo-constants';
import { useLocale } from '@/context/AppContext';

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
const API_BASE =
  process.env.EXPO_PUBLIC_API_BASE?.trim() || (host ? `http://${host}:8000` : fallbackApiBase);
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
  tintN:  '#EBF0FA',
  tintB:  '#EBF4FF',
};

const T = {
  en: {
    eyebrow: 'YOUR FINANCIAL ADVISOR',
    emptyHint: 'Ask Lana anything about your money.',
    emptyHint2: 'Bilingual · Confidential · Free',
    placeholder: 'Ask Lana something...',
    errorMsg: 'Error talking to server.',
    suggestions: [
      '💳  Best bank for me?',
      '✈️  Send money abroad',
      '📈  Build credit fast',
      '❓  What is APR?',
    ],
  },
  es: {
    eyebrow: 'TU ASESORA FINANCIERA',
    emptyHint: 'Pregúntale a Lana sobre tu dinero.',
    emptyHint2: 'Bilingüe · Confidencial · Gratis',
    placeholder: 'Pregúntale a Lana...',
    errorMsg: 'Error al contactar el servidor.',
    suggestions: [
      '💳  ¿Mejor banco para mí?',
      '✈️  Enviar dinero al exterior',
      '📈  Mejorar mi crédito rápido',
      '❓  ¿Qué es el APR?',
    ],
  },
};

type Message = { id: string; role: 'user' | 'assistant'; content: string };

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

export default function ChatScreen() {
  const { locale, lifeStage, userProfile } = useLocale();
  const t = T[locale];

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<FlatList>(null);

  async function send(text?: string) {
    const display = text ?? input;
    const msg = display.replace(/^[^\w¿¡]*/, '').trim();
    if (!display.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: display.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          locale,
          life_stage: lifeStage,
          age: userProfile.age || undefined,
          area: userProfile.area || undefined,
        }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      const reply = data.reply ?? data.response ?? t.errorMsg;
      setMessages([...updated, { id: (Date.now() + 1).toString(), role: 'assistant', content: reply }]);
    } catch (err) {
      const message = err instanceof Error ? err.message : t.errorMsg;
      setMessages([
        ...updated,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `${t.errorMsg} (${message}) @ ${API_BASE}`,
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 84 : 0}
    >
      {/* Header */}
      <View style={s.header}>
        <View style={s.avatarWrap}>
          <View style={s.avatar}>
            <Text style={s.avatarEmoji}>🤖</Text>
          </View>
          <View style={s.online} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.eyebrow}>{t.eyebrow}</Text>
          <Text style={s.title}>Lana AI</Text>
        </View>
        <LangToggle />
      </View>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={loading ? [...messages, { id: '__loading', role: 'assistant' as const, content: '...' }] : messages}
        keyExtractor={m => m.id}
        style={s.list}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={s.emptyWrap}>
            <Text style={s.emptyEmoji}>💬</Text>
            <Text style={s.emptyHint}>{t.emptyHint}</Text>
            <Text style={s.emptyHint2}>{t.emptyHint2}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[s.bubbleWrap, item.role === 'user' ? s.right : s.left]}>
            {item.role === 'assistant' && (
              <View style={s.lBadge}><Text style={s.lBadgeText}>L</Text></View>
            )}
            <View style={item.role === 'user' ? s.userBubble : s.aiBubble}>
              <Text style={item.role === 'user' ? s.userText : s.aiText}>{item.content}</Text>
            </View>
          </View>
        )}
      />

      {/* Suggestions */}
      <View style={s.suggestions}>
        {t.suggestions.map((sug, i) => {
          const emoji = sug.match(/^\S+/)?.[0] ?? '';
          const label = sug.replace(/^\S+\s*/, '');
          return (
            <TouchableOpacity
              key={sug}
              style={[s.chip, i < t.suggestions.length - 1 && s.chipBorder]}
              onPress={() => send(sug)}
              activeOpacity={0.6}
            >
              <Text style={s.chipEmoji}>{emoji}</Text>
              <Text style={s.chipText}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Input */}
      <View style={s.inputRow}>
        <TextInput
          style={s.input}
          value={input}
          onChangeText={setInput}
          placeholder={t.placeholder}
          placeholderTextColor={C.text3}
          onSubmitEditing={() => send()}
          returnKeyType="send"
          editable={!loading}
        />
        <TouchableOpacity style={[s.sendBtn, loading && { opacity: 0.4 }]} onPress={() => send()} disabled={loading}>
          <Text style={s.sendIcon}>▶</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  header: {
    paddingTop: Platform.OS === 'ios' ? 56 : 40,
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: C.card,
    borderBottomWidth: 1,
    borderColor: C.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...Platform.select({ ios: { shadowColor: C.navy, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 }, android: { elevation: 2 } }),
  },
  avatarWrap: { position: 'relative' },
  avatar: { width: 46, height: 46, borderRadius: 14, backgroundColor: C.tintN, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  avatarEmoji: { fontSize: 24 },
  online: { position: 'absolute', bottom: -1, right: -1, width: 12, height: 12, borderRadius: 6, backgroundColor: '#1A7A56', borderWidth: 2, borderColor: C.card },
  eyebrow: { fontSize: 9, color: C.blue, fontWeight: '700', letterSpacing: 2, ...FF },
  title: { fontSize: 20, fontWeight: '800', color: C.text, ...FF },
  list: { flex: 1, backgroundColor: C.bg },
  listContent: { padding: 16, gap: 10, flexGrow: 1 },
  emptyWrap: { alignItems: 'center', marginTop: 48, gap: 8 },
  emptyEmoji: { fontSize: 44 },
  emptyHint: { color: C.text2, fontSize: 15, fontWeight: '600', ...FF },
  emptyHint2: { color: C.text3, fontSize: 12, letterSpacing: 0.5 },
  bubbleWrap: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginVertical: 2 },
  left: { justifyContent: 'flex-start' },
  right: { justifyContent: 'flex-end' },
  lBadge: { width: 26, height: 26, borderRadius: 8, backgroundColor: C.navy, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  lBadgeText: { color: '#fff', fontSize: 11, fontWeight: '800', ...FF },
  userBubble: { backgroundColor: C.navy, borderRadius: 20, borderBottomRightRadius: 5, padding: 12, maxWidth: '78%' },
  aiBubble: { backgroundColor: C.card, borderRadius: 20, borderBottomLeftRadius: 5, padding: 12, maxWidth: '78%', borderWidth: 1, borderColor: C.border },
  userText: { color: '#fff', fontSize: 14, lineHeight: 20, fontWeight: '500' },
  aiText: { color: C.text, fontSize: 14, lineHeight: 20 },
  suggestions: { backgroundColor: C.card, paddingHorizontal: 20, paddingTop: 4, paddingBottom: 4, borderTopWidth: 1, borderColor: C.border },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
  chipBorder: { borderBottomWidth: 1, borderBottomColor: C.border },
  chipEmoji: { fontSize: 16, width: 24, textAlign: 'center' },
  chipText: { color: C.text2, fontSize: 13, fontWeight: '500', ...FF },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 88 : 80,
    backgroundColor: C.card,
    borderTopWidth: 1,
    borderColor: C.border,
  },
  input: { flex: 1, backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, borderRadius: 50, paddingHorizontal: 18, paddingVertical: 12, color: C.text, fontSize: 14, ...FF },
  sendBtn: { width: 46, height: 46, backgroundColor: C.navy, borderRadius: 50, alignItems: 'center', justifyContent: 'center' },
  sendIcon: { color: '#fff', fontSize: 14, fontWeight: '800' },
});
