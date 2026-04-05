import { createContext, useContext, useState } from 'react';

type Locale = 'en' | 'es';
export type LifeStage = 'new-arrival' | 'first-gen' | 'established';

export type UserProfile = {
  name: string;
  age: string;
  area: string;
  email: string;
};

type AppContextType = {
  locale: Locale;
  setLocale: (val: Locale) => void;
  lifeStage: LifeStage;
  setLifeStage: (val: LifeStage) => void;
  userProfile: UserProfile;
  setUserProfile: (val: Partial<UserProfile>) => void;
};

const DEFAULT_PROFILE: UserProfile = { name: '', age: '', area: '', email: '' };

export const AppContext = createContext<AppContextType>({
  locale: 'en',
  setLocale: () => {},
  lifeStage: 'new-arrival',
  setLifeStage: () => {},
  userProfile: DEFAULT_PROFILE,
  setUserProfile: () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');
  const [lifeStage, setLifeStage] = useState<LifeStage>('new-arrival');
  const [userProfile, setProfileState] = useState<UserProfile>(DEFAULT_PROFILE);

  function setUserProfile(val: Partial<UserProfile>) {
    setProfileState(prev => ({ ...prev, ...val }));
  }

  return (
    <AppContext.Provider value={{ locale, setLocale, lifeStage, setLifeStage, userProfile, setUserProfile }}>
      {children}
    </AppContext.Provider>
  );
}

export function useLocale() {
  return useContext(AppContext);
}
