import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/services/supabase';
import type { Session } from '@supabase/supabase-js';

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
  session: Session | null;
  setSession: (val: Session | null) => void;
  signUp: (email: string, password: string) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
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
  session: null,
  setSession: () => {},
  signUp: async () => null,
  signIn: async () => null,
  signOut: async () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');
  const [lifeStage, setLifeStage] = useState<LifeStage>('new-arrival');
  const [userProfile, setProfileState] = useState<UserProfile>(DEFAULT_PROFILE);
  const [financialProfile, setFinancialState] = useState<FinancialProfile>(DEFAULT_FINANCIAL);
  const [session, setSession] = useState<Session | null>(null);

  // Listen for Supabase auth changes
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user?.email) {
        setProfileState(prev => ({ ...prev, email: data.session!.user.email! }));
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s?.user?.email) {
        setProfileState(prev => ({ ...prev, email: s.user.email! }));
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  function setUserProfile(val: Partial<UserProfile>) {
    setProfileState(prev => ({ ...prev, ...val }));
  }

  function setFinancialProfile(val: Partial<FinancialProfile>) {
    setFinancialState(prev => ({ ...prev, ...val }));
  }

  async function signUp(email: string, password: string): Promise<string | null> {
    if (!supabase) return 'Supabase not configured. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to .env';
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return error.message;
    return null;
  }

  async function signIn(email: string, password: string): Promise<string | null> {
    if (!supabase) return 'Supabase not configured. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to .env';
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return error.message;
    return null;
  }

  async function signOut() {
    if (supabase) await supabase.auth.signOut();
    setSession(null);
    setProfileState(DEFAULT_PROFILE);
  }

  return (
    <AppContext.Provider value={{
      locale, setLocale, lifeStage, setLifeStage,
      userProfile, setUserProfile, financialProfile, setFinancialProfile,
      session, setSession, signUp, signIn, signOut,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useLocale() {
  return useContext(AppContext);
}
