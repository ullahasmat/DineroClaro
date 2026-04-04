import Head from 'next/head';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppContext } from '@context/AppContext';
import useChat from '@hooks/useChat';

const SUGGESTED = {
  en: ['Best bank for me?', 'Send money abroad', 'How do I build credit?'],
  es: ['¿Mejor banco para mí?', 'Enviar dinero al exterior', '¿Cómo creo crédito?'],
};

const t = {
  en: {
    title: 'AI Copilot',
    subtitle: 'claude-sonnet · english',
    context: 'Today · context: credit_score = 642, util = 22%',
    placeholder: 'Ask something...',
    home: 'Home',
    learn: 'Learn',
    ai: 'AI',
  },
  es: {
    title: 'AI Copilot',
    subtitle: 'claude-sonnet · español',
    context: 'Hoy · contexto: puntaje = 642, uso = 22%',
    placeholder: 'Pregunta algo...',
    home: 'Inicio',
    learn: 'Aprender',
    ai: 'IA',
  },
};

export default function Chat() {
  const router = useRouter();
  const { locale } = useAppContext();
  const copy = t[locale];
  const suggestions = SUGGESTED[locale];

  const { history, send, loading } = useChat();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, loading]);

  function handleSend(text?: string) {
    const msg = text ?? input;
    if (!msg.trim()) return;
    send(msg);
    setInput('');
  }

  return (
    <>
      <Head>
        <title>DineroClaro | AI Copilot</title>
      </Head>
      <div style={s.root}>
        {/* Header */}
        <div style={s.header}>
          <h1 style={s.headerTitle}>{copy.title}</h1>
          <p style={s.headerSub}>{copy.subtitle}</p>
        </div>

        {/* Context bar */}
        <div style={s.contextBar}>
          <span style={s.contextText}>{copy.context}</span>
        </div>

        {/* Messages */}
        <div style={s.messages}>
          {history.length === 0 && (
            <p style={s.emptyHint}>
              {locale === 'es' ? 'Haz una pregunta para comenzar.' : 'Ask a question to get started.'}
            </p>
          )}

          {history.map((msg, i) => {
            const isUser = msg.role === 'user';
            return (
              <div key={i} style={{ ...s.bubbleWrap, justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
                <div style={isUser ? s.userBubble : s.aiBubble}>
                  {msg.content}
                </div>
              </div>
            );
          })}

          {loading && (
            <div style={{ ...s.bubbleWrap, justifyContent: 'flex-start' }}>
              <div style={{ ...s.aiBubble, color: '#5a8888' }}>...</div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        <div style={s.suggestions}>
          {suggestions.map((s_) => (
            <button key={s_} style={s.chip} onClick={() => handleSend(s_)}>
              {s_}
            </button>
          ))}
        </div>

        {/* Input */}
        <div style={s.inputRow}>
          <input
            style={s.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={copy.placeholder}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button style={s.sendBtn} onClick={() => handleSend()} disabled={loading}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>

        {/* Bottom nav */}
        <nav style={s.nav}>
          <button style={s.navBtn} onClick={() => router.push('/dashboard')}>
            {copy.home}
          </button>
          <button style={s.navBtn} onClick={() => router.push('/learn')}>
            {copy.learn}
          </button>
          <button style={{ ...s.navBtn, color: '#fff' }} onClick={() => router.push('/chat')}>
            <span style={s.navDot} />
            {copy.ai}
          </button>
        </nav>
      </div>
    </>
  );
}

const s: Record<string, React.CSSProperties> = {
  root: {
    height: '100vh',
    backgroundColor: '#0d1a1a',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#fff',
  },
  header: {
    width: '100%',
    maxWidth: 420,
    padding: '1.5rem 1rem 0.5rem',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 700,
    margin: 0,
  },
  headerSub: {
    fontSize: 12,
    color: '#5a8888',
    margin: '2px 0 0',
  },
  contextBar: {
    width: '100%',
    maxWidth: 420,
    padding: '6px 1rem',
    borderTop: '1px solid #1e3333',
    borderBottom: '1px solid #1e3333',
  },
  contextText: {
    fontSize: 11,
    color: '#5a8888',
  },
  messages: {
    flex: 1,
    width: '100%',
    maxWidth: 420,
    overflowY: 'auto',
    padding: '0.75rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  emptyHint: {
    color: '#5a8888',
    fontSize: 13,
    textAlign: 'center',
    marginTop: '2rem',
  },
  bubbleWrap: {
    display: 'flex',
    width: '100%',
  },
  userBubble: {
    backgroundColor: '#1db896',
    color: '#fff',
    borderRadius: '14px 14px 4px 14px',
    padding: '10px 14px',
    maxWidth: '78%',
    fontSize: 14,
    lineHeight: 1.5,
  },
  aiBubble: {
    backgroundColor: '#122222',
    color: '#e0f0f0',
    borderRadius: '14px 14px 14px 4px',
    padding: '10px 14px',
    maxWidth: '78%',
    fontSize: 14,
    lineHeight: 1.5,
  },
  suggestions: {
    width: '100%',
    maxWidth: 420,
    display: 'flex',
    gap: '0.5rem',
    padding: '0 1rem 0.5rem',
    overflowX: 'auto',
  },
  chip: {
    backgroundColor: '#122222',
    border: '1px solid #1e3d3d',
    color: '#8ab8b8',
    borderRadius: 20,
    padding: '6px 12px',
    fontSize: 12,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  inputRow: {
    width: '100%',
    maxWidth: 420,
    display: 'flex',
    gap: '0.5rem',
    padding: '0 1rem 0.75rem',
  },
  input: {
    flex: 1,
    backgroundColor: '#122222',
    border: '1px solid #1e3d3d',
    borderRadius: 12,
    padding: '11px 14px',
    color: '#fff',
    fontSize: 14,
    outline: 'none',
  },
  sendBtn: {
    backgroundColor: '#1db896',
    border: 'none',
    borderRadius: 12,
    width: 44,
    height: 44,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#fff',
    flexShrink: 0,
  },
  nav: {
    width: '100%',
    maxWidth: 420,
    display: 'flex',
    justifyContent: 'space-around',
    padding: '0.75rem 0 0.5rem',
    borderTop: '1px solid #1e3333',
  },
  navBtn: {
    background: 'none',
    border: 'none',
    color: '#5a8888',
    fontSize: 13,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  navDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: '#fff',
  },
};
