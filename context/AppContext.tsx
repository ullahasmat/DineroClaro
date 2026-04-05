import { createContext, useContext, useState } from 'react';

type Locale = 'en' | 'es';
export type LifeStage = 'new-arrival' | 'first-gen' | 'established';

type AppContextType = {
  locale: Locale;
  setLocale: (val: Locale) => void;
  lifeStage: LifeStage;
  setLifeStage: (val: LifeStage) => void;
};

export const AppContext = createContext<AppContextType>({
  locale: 'en',
  setLocale: () => {},
  lifeStage: 'new-arrival',
  setLifeStage: () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');
  const [lifeStage, setLifeStage] = useState<LifeStage>('new-arrival');
  return (
    <AppContext.Provider value={{ locale, setLocale, lifeStage, setLifeStage }}>
      {children}
    </AppContext.Provider>
  );
}

export function useLocale() {
  return useContext(AppContext);
}
