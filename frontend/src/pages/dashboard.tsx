import Head from 'next/head';
import RecommendationCard from '@components/RecommendationCard';
import LanguageToggle from '@components/LanguageToggle';

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>DineroClaro | Dashboard</title>
      </Head>
      <main style={{ padding: '2rem', maxWidth: 960, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Dashboard</h1>
          <LanguageToggle />
        </div>
        <p>Track progress and next steps.</p>
        <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
          <RecommendationCard title="Complete onboarding" summary="Finish profile to tailor advice." />
          <RecommendationCard title="Fund your emergency account" summary="Transfer $20 this week." />
        </div>
      </main>
    </>
  );
}
