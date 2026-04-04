import { createContext } from 'react';

type AppContextType = { locale: 'en' | 'es' };

export const AppContext = createContext<AppContextType>({ locale: 'en' });
