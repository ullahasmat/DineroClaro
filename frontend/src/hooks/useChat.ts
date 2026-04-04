import { useState } from 'react';
import { postChat } from '@services/api';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function useChat() {
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const send = async (message: string) => {
    setLoading(true);
    setHistory((prev) => [...prev, { role: 'user', content: message }]);
    try {
      const res = await postChat({ message });
      setHistory((prev) => [...prev, { role: 'assistant', content: res.reply }]);
    } catch (err) {
      setHistory((prev) => [...prev, { role: 'assistant', content: 'Error talking to server.' }]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { history, send, loading };
}
