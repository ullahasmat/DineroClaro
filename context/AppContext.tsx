import { createContext, useContext, useState } from 'react';

type Locale = 'en' | 'es';

type AppContextType = {
  locale: Locale;
  setLocale: (val: Locale) => void;
};

export const AppContext = createContext<AppContextType>({
  locale: 'en',
  setLocale: () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');
  return (
    <AppContext.Provider value={{ locale, setLocale }}>
      {children}
    </AppContext.Provider>
  );
}

export function useLocale() {
  return useContext(AppContext);
}
