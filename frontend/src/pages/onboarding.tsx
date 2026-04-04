import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAppContext } from '@context/AppContext';

const t = {
  en: {
    title: 'Welcome',
    step: 'Step 2 of 3 — your finances',
    manual: 'Enter your info manually',
    creditScore: 'Approx. credit score',
    income: 'Monthly income',
    checking: 'Checking balance',
    cardBalance: 'Card balance / limit',
    privacy: "We don't connect to your bank. Update anytime.",
    cta: 'Build my plan →',
    home: 'Home',
    learn: 'Learn',
    ai: 'AI',
  },
  es: {
    title: 'Bienvenido',
    step: 'Paso 2 de 3 — tus finanzas',
    manual: 'Ingresa tu información manualmente',
    creditScore: 'Puntaje de crédito aprox.',
    income: 'Ingreso mensual',
    checking: 'Saldo en cuenta',
    cardBalance: 'Saldo / límite de tarjeta',
    privacy: 'No nos conectamos a tu banco. Actualiza cuando quieras.',
    cta: 'Crear mi plan →',
    home: 'Inicio',
    learn: 'Aprender',
    ai: 'IA',
  },
};

export default function Onboarding() {
  const router = useRouter();
  const { locale } = useAppContext();
  const copy = t[locale];

  const [form, setForm] = useState({
    creditScore: '',
    income: '',
    checking: '',
    cardBalance: '',
    cardLimit: '',
  });

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push('/dashboard');
  }

  return (
    <>
      <Head>
        <title>DineroClaro | Onboarding</title>
      </Head>
      <div style={s.root}>
        <div style={s.card}>
          {/* Icon */}
          <div style={s.iconWrap}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>

          <h1 style={s.heading}>{copy.title}</h1>
          <p style={s.subheading}>{copy.step}</p>

          {/* Progress bar */}
          <div style={s.progressTrack}>
            <div style={{ ...s.progressFill, width: '66%' }} />
          </div>

          <p style={s.label}>{copy.manual}</p>

          <form onSubmit={handleSubmit} style={s.form}>
            <input
              style={s.input}
              type="number"
              placeholder={copy.creditScore}
              value={form.creditScore}
              onChange={set('creditScore')}
              min={300}
              max={850}
            />
            <input
              style={s.input}
              type="number"
              placeholder={copy.income}
              value={form.income}
              onChange={set('income')}
              min={0}
            />
            <input
              style={s.input}
              type="number"
              placeholder={copy.checking}
              value={form.checking}
              onChange={set('checking')}
              min={0}
            />
            <div style={s.splitRow}>
              <input
                style={{ ...s.input, flex: 1 }}
                type="number"
                placeholder={copy.cardBalance}
                value={form.cardBalance}
                onChange={set('cardBalance')}
                min={0}
              />
              <span style={s.dollarBadge}>$</span>
              <input
                style={{ ...s.input, flex: 1 }}
                type="number"
                placeholder="Limit"
                value={form.cardLimit}
                onChange={set('cardLimit')}
                min={0}
              />
            </div>

            <p style={s.privacy}>{copy.privacy}</p>

            <button type="submit" style={s.cta}>
              {copy.cta}
            </button>
          </form>
        </div>

        {/* Bottom nav */}
        <nav style={s.nav}>
          <button style={{ ...s.navBtn, ...s.navActive }} onClick={() => router.push('/')}>
            <span style={s.navDot} />
            {copy.home}
          </button>
          <button style={s.navBtn} onClick={() => router.push('/learn')}>
            {copy.learn}
          </button>
          <button style={s.navBtn} onClick={() => router.push('/chat')}>
            {copy.ai}
          </button>
        </nav>

        <p style={s.debugLabel}>ONBOARDING (MANUAL)</p>
      </div>
    </>
  );
}

const s: Record<string, React.CSSProperties> = {
  root: {
    minHeight: '100vh',
    backgroundColor: '#0d1a1a',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '2rem 1rem 1rem',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#fff',
  },
  card: {
    width: '100%',
    maxWidth: 380,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#1a9e7a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
  heading: {
    fontSize: 26,
    fontWeight: 700,
    margin: '0 0 4px',
  },
  subheading: {
    fontSize: 13,
    color: '#8ab8b8',
    margin: '0 0 14px',
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: '#1e3333',
    borderRadius: 4,
    marginBottom: '1.5rem',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1db896',
    borderRadius: 4,
  },
  label: {
    fontSize: 14,
    color: '#a0c4c4',
    alignSelf: 'flex-start',
    marginBottom: '0.75rem',
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  input: {
    backgroundColor: '#162828',
    border: '1px solid #1e3d3d',
    borderRadius: 10,
    padding: '12px 14px',
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  splitRow: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  dollarBadge: {
    color: '#8ab8b8',
    fontSize: 16,
    fontWeight: 600,
  },
  privacy: {
    fontSize: 12,
    color: '#5a8888',
    textAlign: 'center',
    margin: '4px 0',
  },
  cta: {
    backgroundColor: '#1db896',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    padding: '14px',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
  nav: {
    width: '100%',
    maxWidth: 380,
    display: 'flex',
    justifyContent: 'space-around',
    padding: '1rem 0 0.5rem',
    borderTop: '1px solid #1e3333',
    marginTop: '1.5rem',
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
  navActive: {
    color: '#fff',
  },
  navDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: '#fff',
  },
  debugLabel: {
    fontSize: 10,
    color: '#2a4a4a',
    letterSpacing: 1,
    marginTop: '0.5rem',
  },
};
