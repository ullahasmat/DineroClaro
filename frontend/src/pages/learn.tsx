import Head from 'next/head';
import RecommendationCard from '@components/RecommendationCard';

export default function Learn() {
  return (
    <>
      <Head>
        <title>DineroClaro | Learn</title>
      </Head>
      <main style={{ padding: '2rem', maxWidth: 960, margin: '0 auto' }}>
        <h1>Learn</h1>
        <p>Curated lessons and tips to improve your financial literacy.</p>
        <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
          <RecommendationCard title="Emergency fund" summary="Start with $20 this week." />
          <RecommendationCard title="Snowball your debt" summary="Pay smallest balance first to build momentum." />
        </div>
      </main>
    </>
  );
}
