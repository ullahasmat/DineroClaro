import Head from 'next/head';
import ChatBox from '@components/ChatBox';

export default function Chat() {
  return (
    <>
      <Head>
        <title>DineroClaro | Chat</title>
      </Head>
      <main style={{ padding: '2rem', maxWidth: 960, margin: '0 auto' }}>
        <h1>Chat with DineroClaro</h1>
        <ChatBox />
      </main>
    </>
  );
}
