const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export function postChat(body: { message: string; user_id?: number; locale?: string }) {
  return request<{ reply: string; source?: string }>('/chat/', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function fetchRecommendations(body: { user_id?: number; locale?: string } = {}) {
  return request<{ items: Array<{ title: string; summary: string; action_url?: string }> }>(
    '/recommendations/',
    {
      method: 'POST',
      body: JSON.stringify(body),
    }
  );
}
