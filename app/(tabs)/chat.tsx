import { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, StyleSheet,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useLocale } from '@/context/AppContext';

const API_BASE = 'http://localhost:8000';
const FONT = Platform.OS === 'ios' ? 'Avenir Next' : undefined;

const T = {
  en: {
    eyebrow: '◆ YOUR FINANCIAL AI ◆',
    context: 'credit_score=642  util=22%  lang=en',
    emptyHint: 'Ask Lana anything about your money.',
    emptyHint2: 'Bilingual · Confidential · Free',
    placeholder: 'Ask something...',
    errorMsg: 'Error talking to server.',
    suggestions: [
      '💳  Best bank for me?',
      '✈️  Send money abroad',
      '📈  Build credit fast',
      '❓  What is APR?',
    ],
  },
  es: {
    eyebrow: '◆ TU IA FINANCIERA ◆',
    context: 'puntaje=642  uso=22%  idioma=es',
    emptyHint: 'Pregúntale a Lana sobre tu dinero.',
    emptyHint2: 'Bilingüe · Confidencial · Gratis',
    placeholder: 'Pregunta algo...',
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

export default function ChatScreen() {
  const { locale } = useLocale();
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
        body: JSON.stringify({ message: msg, locale }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setMessages([...updated, { id: (Date.now() + 1).toString(), role: 'assistant', content: data.reply }]);
    } catch {
      setMessages([...updated, { id: (Date.now() + 1).toString(), role: 'assistant', content: t.errorMsg }]);
    } finally {
      setLoading(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={84}
    >
      <View style={s.header}>
        <View style={s.avatarWrap}>
          <View style={s.avatar}>
            <Text style={s.avatarEmoji}>🤖</Text>
          </View>
          <View style={s.avatarOnline} />
        </View>
        <View style={s.headerText}>
          <Text style={s.headerEyebrow}>{t.eyebrow}</Text>
          <Text style={s.headerTitle}>Lana AI</Text>
        </View>
        <LangToggle />
      </View>

      <View style={s.contextBar}>
        <Text style={s.contextPre}>{'> '}</Text>
        <Text style={s.contextText}>{t.context}</Text>
      </View>

      <FlatList
        ref={listRef}
        data={loading
          ? [...messages, { id: '__loading', role: 'assistant' as const, content: '...' }]
          : messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={s.messageList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={s.emptyWrap}>
            <Text style={s.emptyEmoji}>💬</Text>
            <Text style={s.emptyHint}>{t.emptyHint}</Text>
            <Text style={s.emptyHint2}>{t.emptyHint2}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[s.bubbleWrap, item.role === 'user' ? s.bubbleRight : s.bubbleLeft]}>
            {item.role === 'assistant' && (
              <View style={s.aiBadge}><Text style={s.aiBadgeText}>L</Text></View>
            )}
            <View style={item.role === 'user' ? s.userBubble : s.aiBubble}>
              <Text style={item.role === 'user' ? s.userText : s.aiText}>{item.content}</Text>
            </View>
          </View>
        )}
      />

      <View style={s.suggestions}>
        {t.suggestions.map((sug, i) => {
          const emoji = sug.match(/^\S+/)?.[0] ?? '';
          const label = sug.replace(/^\S+\s*/, '');
          return (
            <TouchableOpacity key={sug} style={[s.chip, i < t.suggestions.length - 1 && s.chipBorder]} onPress={() => send(sug)} activeOpacity={0.6}>
              <Text style={s.chipEmoji}>{emoji}</Text>
              <Text style={s.chipText}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={s.inputRow}>
        <TextInput
          style={s.input}
          value={input}
          onChangeText={setInput}
          placeholder={t.placeholder}
          placeholderTextColor="#44446A"
          onSubmitEditing={() => send()}
          returnKeyType="send"
          editable={!loading}
        />
        <TouchableOpacity
          style={[s.sendBtn, loading && { opacity: 0.4 }]}
          onPress={() => send()}
          disabled={loading}
        >
          <Text style={s.sendIcon}>▶</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#08081A' },
  header: {
    paddingTop: Platform.OS === 'ios' ? 56 : 40,
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: '#0B0B1E',
    borderBottomWidth: 1.5,
    borderColor: '#7B3FFF55',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarWrap: { position: 'relative' },
  avatar: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#1A0A3A', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#7B3FFF66' },
  avatarEmoji: { fontSize: 24 },
  avatarOnline: { position: 'absolute', bottom: -2, right: -2, width: 12, height: 12, borderRadius: 6, backgroundColor: '#00E5A8', borderWidth: 2, borderColor: '#0B0B1E' },
  headerText: { flex: 1 },
  headerEyebrow: { fontSize: 9, color: '#7B3FFF', fontWeight: '800', letterSpacing: 2, ...(FONT ? { fontFamily: FONT } : {}) },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#fff', ...(FONT ? { fontFamily: FONT } : {}) },
  contextBar: { paddingHorizontal: 16, paddingVertical: 7, backgroundColor: '#06061A', borderBottomWidth: 1, borderColor: '#1C1C38', flexDirection: 'row', alignItems: 'center' },
  contextPre: { color: '#7B3FFF', fontSize: 12, fontWeight: '800', marginRight: 4 },
  contextText: { fontSize: 11, color: '#44446A', fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace' },
  messageList: { padding: 16, gap: 10, flexGrow: 1, paddingBottom: 8 },
  emptyWrap: { alignItems: 'center', marginTop: 40, gap: 6 },
  emptyEmoji: { fontSize: 42 },
  emptyHint: { color: '#9090B8', fontSize: 14, fontWeight: '600', ...(FONT ? { fontFamily: FONT } : {}) },
  emptyHint2: { color: '#3C3C5C', fontSize: 11, letterSpacing: 1 },
  bubbleWrap: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginVertical: 2 },
  bubbleLeft: { justifyContent: 'flex-start' },
  bubbleRight: { justifyContent: 'flex-end' },
  aiBadge: { width: 26, height: 26, borderRadius: 8, backgroundColor: '#7B3FFF', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  aiBadgeText: { color: '#fff', fontSize: 11, fontWeight: '800', ...(FONT ? { fontFamily: FONT } : {}) },
  userBubble: { backgroundColor: '#7B3FFF', borderRadius: 20, borderBottomRightRadius: 6, padding: 12, maxWidth: '78%' },
  aiBubble: { backgroundColor: '#0F0F24', borderRadius: 20, borderBottomLeftRadius: 6, padding: 12, maxWidth: '78%', borderWidth: 1.5, borderColor: '#1C1C38' },
  userText: { color: '#fff', fontSize: 14, lineHeight: 20, fontWeight: '500' },
  aiText: { color: '#D0D0E8', fontSize: 14, lineHeight: 20 },
  suggestions: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 4 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 4 },
  chipBorder: { borderBottomWidth: 1, borderBottomColor: '#1C1C38' },
  chipEmoji: { fontSize: 16, width: 24, textAlign: 'center' },
  chipText: { color: '#9090B8', fontSize: 13, fontWeight: '500' },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 104 : 96,
    paddingTop: 8,
    backgroundColor: '#06061A',
    borderTopWidth: 1,
    borderColor: '#1C1C38',
  },
  input: { flex: 1, backgroundColor: '#0F0F24', borderWidth: 1.5, borderColor: '#1C1C38', borderRadius: 50, paddingHorizontal: 18, paddingVertical: 12, color: '#fff', fontSize: 14 },
  sendBtn: { width: 46, height: 46, backgroundColor: '#7B3FFF', borderRadius: 50, alignItems: 'center', justifyContent: 'center' },
  sendIcon: { color: '#fff', fontSize: 14, fontWeight: '800' },
});
