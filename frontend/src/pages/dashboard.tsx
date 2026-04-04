import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAppContext } from '@context/AppContext';

const t = {
  en: {
    greeting: 'Good morning,',
    creditScore: 'Credit score',
    fair: 'Fair',
    goal: 'Goal: 720 · 78 pts away',
    checkingBalance: 'Checking balance',
    selfReported: 'self-reported',
    cardUtil: 'Card utilization',
    goodRange: 'Good range',
    lessonsDone: 'Lessons done',
    xpEarned: 'XP earned',
    level: 'Level 2',
    nextSteps: 'Your next steps',
    step1Title: 'Pay credit card on time',
    step1Sub: 'Keeps utilization low',
    step2Title: 'Learn: How does APR work?',
    step2Sub: '5 min · earn 50 xp',
    home: 'Home',
    learn: 'Learn',
    ai: 'AI',
  },
  es: {
    greeting: 'Buenos días,',
    creditScore: 'Puntaje de crédito',
    fair: 'Regular',
    goal: 'Meta: 720 · 78 pts más',
    checkingBalance: 'Saldo en cuenta',
    selfReported: 'auto-reportado',
    cardUtil: 'Uso de tarjeta',
    goodRange: 'Buen rango',
    lessonsDone: 'Lecciones hechas',
    xpEarned: 'XP ganados',
    level: 'Nivel 2',
    nextSteps: 'Tus próximos pasos',
    step1Title: 'Paga tu tarjeta a tiempo',
    step1Sub: 'Mantiene el uso bajo',
    step2Title: 'Aprende: ¿Qué es el APR?',
    step2Sub: '5 min · gana 50 xp',
    home: 'Inicio',
    learn: 'Aprender',
    ai: 'IA',
  },
};

export default function Dashboard() {
  const router = useRouter();
  const { locale } = useAppContext();
  const copy = t[locale];

  return (
    <>
      <Head>
        <title>DineroClaro | Home</title>
      </Head>
      <div style={s.root}>
        <div style={s.content}>
          {/* Greeting */}
          <p style={s.greeting}>{copy.greeting}</p>
          <h1 style={s.name}>Carlos</h1>

          {/* Credit score card */}
          <div style={s.card}>
            <p style={s.cardLabel}>{copy.creditScore}</p>
            <div style={s.scoreRow}>
              <span style={s.scoreNum}>642</span>
              <span style={s.fairBadge}>{copy.fair}</span>
            </div>
            <div style={s.progressTrack}>
              <div style={{ ...s.progressFill, width: '62%' }} />
            </div>
            <p style={s.goalText}>{copy.goal}</p>
          </div>

          {/* 2-col stats */}
          <div style={s.grid2}>
            <div style={s.card}>
              <p style={s.cardLabel}>{copy.checkingBalance}</p>
              <p style={s.bigNum}>$1,240</p>
              <p style={s.subLabel}>{copy.selfReported}</p>
            </div>
            <div style={s.card}>
              <p style={s.cardLabel}>{copy.cardUtil}</p>
              <p style={{ ...s.bigNum, color: '#1db896' }}>22%</p>
              <p style={{ ...s.subLabel, color: '#1db896' }}>{copy.goodRange}</p>
            </div>
          </div>

          <div style={s.grid2}>
            <div style={s.card}>
              <p style={s.cardLabel}>{copy.lessonsDone}</p>
              <p style={s.bigNum}>4 / 12</p>
              <div style={s.progressTrack}>
                <div style={{ ...s.progressFill, width: '33%' }} />
              </div>
            </div>
            <div style={s.card}>
              <p style={s.cardLabel}>{copy.xpEarned}</p>
              <p style={s.bigNum}>320 xp</p>
              <span style={s.levelBadge}>{copy.level}</span>
            </div>
          </div>

          {/* Next steps */}
          <div style={s.card}>
            <p style={s.cardLabel}>{copy.nextSteps}</p>
            <div style={s.stepItem}>
              <div style={s.stepNum}>1</div>
              <div>
                <p style={s.stepTitle}>{copy.step1Title}</p>
                <p style={s.stepSub}>{copy.step1Sub}</p>
              </div>
            </div>
            <div style={{ ...s.stepItem, opacity: 0.5 }}>
              <div style={{ ...s.stepNum, backgroundColor: '#1e3333' }}>2</div>
              <div>
                <p style={s.stepTitle}>{copy.step2Title}</p>
                <p style={s.stepSub}>{copy.step2Sub}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom nav */}
        <nav style={s.nav}>
          <button style={{ ...s.navBtn, color: '#fff' }} onClick={() => router.push('/dashboard')}>
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

        <p style={s.debugLabel}>HOME (SELF-REPORTED)</p>
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
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#fff',
    padding: '0 0 1rem',
  },
  content: {
    width: '100%',
    maxWidth: 420,
    padding: '2rem 1rem 0',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  greeting: {
    fontSize: 15,
    color: '#8ab8b8',
    margin: 0,
  },
  name: {
    fontSize: 26,
    fontWeight: 700,
    margin: '0 0 0.5rem',
  },
  card: {
    backgroundColor: '#122222',
    borderRadius: 14,
    padding: '14px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  cardLabel: {
    fontSize: 12,
    color: '#8ab8b8',
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scoreRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  scoreNum: {
    fontSize: 38,
    fontWeight: 800,
    lineHeight: 1,
  },
  fairBadge: {
    backgroundColor: '#c97a1a',
    color: '#fff',
    borderRadius: 20,
    padding: '3px 10px',
    fontSize: 12,
    fontWeight: 600,
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: '#1e3333',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1db896',
    borderRadius: 4,
  },
  goalText: {
    fontSize: 12,
    color: '#8ab8b8',
    margin: 0,
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem',
  },
  bigNum: {
    fontSize: 24,
    fontWeight: 700,
    margin: 0,
  },
  subLabel: {
    fontSize: 11,
    color: '#8ab8b8',
    margin: 0,
  },
  levelBadge: {
    backgroundColor: '#1a3333',
    color: '#1db896',
    borderRadius: 8,
    padding: '2px 8px',
    fontSize: 11,
    fontWeight: 600,
    alignSelf: 'flex-start',
  },
  stepItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    paddingTop: 8,
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    backgroundColor: '#1db896',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    fontWeight: 700,
    flexShrink: 0,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: 600,
    margin: 0,
  },
  stepSub: {
    fontSize: 12,
    color: '#1db896',
    margin: '2px 0 0',
  },
  nav: {
    width: '100%',
    maxWidth: 420,
    display: 'flex',
    justifyContent: 'space-around',
    padding: '1rem 0 0.5rem',
    borderTop: '1px solid #1e3333',
    marginTop: '1rem',
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
  debugLabel: {
    fontSize: 10,
    color: '#2a4a4a',
    letterSpacing: 1,
    marginTop: '0.5rem',
  },
};
