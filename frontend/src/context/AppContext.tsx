import { createContext, useContext, useState } from 'react';

type AppContextType = {
  locale: 'en' | 'es';
  setLocale: (val: 'en' | 'es') => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<'en' | 'es'>('en');

  return <AppContext.Provider value={{ locale, setLocale }}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
