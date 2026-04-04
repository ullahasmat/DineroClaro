import { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, ScrollView, StyleSheet,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useLocale } from '@/context/AppContext';

const API_BASE = 'http://localhost:8000';

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

function Scanlines() {
  return (
    <View style={sc.wrap}>
      {Array.from({ length: 5 }).map((_, i) => (
        <View key={i} style={sc.line} />
      ))}
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
      keyboardVerticalOffset={60}
    >
      <View style={s.header}>
        <Scanlines />
        <View style={s.headerInner}>
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
          <View style={s.termDots}>
            <View style={[s.dot, { backgroundColor: '#FF6B6B' }]} />
            <View style={[s.dot, { backgroundColor: '#FFE566' }]} />
            <View style={[s.dot, { backgroundColor: '#1db896' }]} />
          </View>
        </View>
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

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.suggestions}>
        {t.suggestions.map((sug) => (
          <TouchableOpacity key={sug} style={s.chip} onPress={() => send(sug)}>
            <Text style={s.chipText}>{sug}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={s.inputRow}>
        <Text style={s.inputPrefix}>{'>'}</Text>
        <TextInput
          style={s.input}
          value={input}
          onChangeText={setInput}
          placeholder={t.placeholder}
          placeholderTextColor="#3a6868"
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

const sc = StyleSheet.create({
  wrap: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, gap: 10, overflow: 'hidden', opacity: 0.06 },
  line: { height: 1, backgroundColor: '#1db896', width: '100%' },
});

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0d1a1a' },
  header: { paddingTop: Platform.OS === 'ios' ? 56 : 40, paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#0a1f1f', borderBottomWidth: 2, borderColor: '#1db896', overflow: 'hidden' },
  headerInner: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarWrap: { position: 'relative' },
  avatar: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#7C5CBF', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#5a3a9e' },
  avatarEmoji: { fontSize: 24 },
  avatarOnline: { position: 'absolute', bottom: -2, right: -2, width: 12, height: 12, borderRadius: 6, backgroundColor: '#1db896', borderWidth: 2, borderColor: '#0a1f1f' },
  headerText: { flex: 1 },
  headerEyebrow: { fontSize: 9, color: '#1db896', fontWeight: '800', letterSpacing: 2 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#fff' },
  termDots: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5 },
  contextBar: { paddingHorizontal: 16, paddingVertical: 6, backgroundColor: '#061212', borderBottomWidth: 1, borderColor: '#1e3333', flexDirection: 'row', alignItems: 'center' },
  contextPre: { color: '#1db896', fontSize: 12, fontWeight: '800', marginRight: 4 },
  contextText: { fontSize: 11, color: '#3a7070', fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace' },
  messageList: { padding: 16, gap: 10, flexGrow: 1 },
  emptyWrap: { alignItems: 'center', marginTop: 40, gap: 6 },
  emptyEmoji: { fontSize: 40 },
  emptyHint: { color: '#5a8888', fontSize: 14, fontWeight: '600' },
  emptyHint2: { color: '#2a5050', fontSize: 11, letterSpacing: 1 },
  bubbleWrap: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginVertical: 2 },
  bubbleLeft: { justifyContent: 'flex-start' },
  bubbleRight: { justifyContent: 'flex-end' },
  aiBadge: { width: 24, height: 24, borderRadius: 6, backgroundColor: '#7C5CBF', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  aiBadgeText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  userBubble: { backgroundColor: '#1db896', borderRadius: 14, borderBottomRightRadius: 4, padding: 12, maxWidth: '78%', borderWidth: 2, borderColor: '#16a07a' },
  aiBubble: { backgroundColor: '#122222', borderRadius: 14, borderBottomLeftRadius: 4, padding: 12, maxWidth: '78%', borderWidth: 2, borderColor: '#1e3d3d' },
  userText: { color: '#fff', fontSize: 14, lineHeight: 20, fontWeight: '500' },
  aiText: { color: '#d0eee8', fontSize: 14, lineHeight: 20 },
  suggestions: { paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
  chip: { backgroundColor: '#0d2020', borderWidth: 2, borderColor: '#1e3d3d', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  chipText: { color: '#8ab8b8', fontSize: 12, fontWeight: '600' },
  inputRow: { flexDirection: 'row', gap: 8, alignItems: 'center', paddingHorizontal: 16, paddingBottom: Platform.OS === 'ios' ? 28 : 14, paddingTop: 6, backgroundColor: '#061212', borderTopWidth: 1, borderColor: '#1e3333' },
  inputPrefix: { color: '#1db896', fontSize: 16, fontWeight: '800', fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace' },
  input: { flex: 1, backgroundColor: '#0d1e1e', borderWidth: 2, borderColor: '#1e3d3d', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, color: '#fff', fontSize: 14 },
  sendBtn: { width: 44, height: 44, backgroundColor: '#1db896', borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#16a07a' },
  sendIcon: { color: '#fff', fontSize: 14, fontWeight: '800' },
});
