import { useState } from 'react';

export default function LanguageToggle() {
  const [locale, setLocale] = useState<'en' | 'es'>('en');

  return (
    <button
      onClick={() => setLocale(locale === 'en' ? 'es' : 'en')}
      style={{ padding: '0.5rem 0.75rem', borderRadius: 6, border: '1px solid #ddd' }}
    >
      {locale === 'en' ? 'ES' : 'EN'}
    </button>
  );
}
