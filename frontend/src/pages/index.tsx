import Head from 'next/head';
import Link from 'next/link';
import ChatBox from '@components/ChatBox';

export default function Home() {
  return (
    <>
      <Head>
        <title>DineroClaro | Home</title>
      </Head>
      <main style={{ padding: '2rem', maxWidth: 960, margin: '0 auto' }}>
        <h1>DineroClaro</h1>
        <p>Bilingual financial literacy with an AI coach.</p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Link href="/learn">Learn</Link>
          <Link href="/chat">Chat</Link>
          <Link href="/dashboard">Dashboard</Link>
        </div>
        <section style={{ marginTop: '2rem' }}>
          <ChatBox />
        </section>
      </main>
    </>
  );
}
