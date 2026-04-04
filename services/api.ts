export const API_BASE = process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:8000';

export const request = async (path: string, options: RequestInit = {}) => {
  const res = await fetch(`${API_BASE}${path}`, { headers: { 'Content-Type': 'application/json' }, ...options });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
};
