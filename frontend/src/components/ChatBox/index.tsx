import { useState } from 'react';
import useChat from '@hooks/useChat';

export default function ChatBox() {
  const [message, setMessage] = useState('');
  const { send, loading, history } = useChat();

  return (
    <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: 8 }}>
      <div style={{ minHeight: 120, marginBottom: '1rem' }}>
        {history.length === 0 && <p>Ask a money question to get started.</p>}
        {history.map((item, idx) => (
          <p key={idx}>
            <strong>{item.role}:</strong> {item.content}
          </p>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!message.trim()) return;
          send(message);
          setMessage('');
        }}
      >
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about budgeting, saving, debt..."
          style={{ width: '75%', padding: '0.5rem' }}
        />
        <button type="submit" disabled={loading} style={{ marginLeft: '0.5rem' }}>
          {loading ? 'Thinking...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
