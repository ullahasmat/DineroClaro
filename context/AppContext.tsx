import { createContext, useContext, useState } from 'react';

type Locale = 'en' | 'es';
export type LifeStage = 'new-arrival' | 'first-gen' | 'established';

export type UserProfile = {
  name: string;
  age: string;
  area: string;
  email: string;
};

export type FinancialProfile = {
  creditScore: string;
  income: string;
  checking: string;
  cards: { name: string; balance: string; limit: string }[];
};

type AppContextType = {
  locale: Locale;
  setLocale: (val: Locale) => void;
  lifeStage: LifeStage;
  setLifeStage: (val: LifeStage) => void;
  userProfile: UserProfile;
  setUserProfile: (val: Partial<UserProfile>) => void;
  financialProfile: FinancialProfile;
  setFinancialProfile: (val: Partial<FinancialProfile>) => void;
};

const DEFAULT_PROFILE: UserProfile = { name: '', age: '', area: '', email: '' };
const DEFAULT_FINANCIAL: FinancialProfile = { creditScore: '', income: '', checking: '', cards: [] };

export const AppContext = createContext<AppContextType>({
  locale: 'en',
  setLocale: () => {},
  lifeStage: 'new-arrival',
  setLifeStage: () => {},
  userProfile: DEFAULT_PROFILE,
  setUserProfile: () => {},
  financialProfile: DEFAULT_FINANCIAL,
  setFinancialProfile: () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');
  const [lifeStage, setLifeStage] = useState<LifeStage>('new-arrival');
  const [userProfile, setProfileState] = useState<UserProfile>(DEFAULT_PROFILE);
  const [financialProfile, setFinancialState] = useState<FinancialProfile>(DEFAULT_FINANCIAL);

  function setUserProfile(val: Partial<UserProfile>) {
    setProfileState(prev => ({ ...prev, ...val }));
  }

  function setFinancialProfile(val: Partial<FinancialProfile>) {
    setFinancialState(prev => ({ ...prev, ...val }));
  }

  return (
    <AppContext.Provider value={{ locale, setLocale, lifeStage, setLifeStage, userProfile, setUserProfile, financialProfile, setFinancialProfile }}>
      {children}
    </AppContext.Provider>
  );
}

export function useLocale() {
  return useContext(AppContext);
}
