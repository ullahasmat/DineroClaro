import { useState } from 'react';
import { Button } from 'react-native';

export default function LanguageToggle() {
  const [locale, setLocale] = useState<'en' | 'es'>('en');
  return <Button title={locale === 'en' ? 'ES' : 'EN'} onPress={() => setLocale(locale === 'en' ? 'es' : 'en')} />;
}
