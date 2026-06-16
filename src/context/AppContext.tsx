import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { LocationData, ConditionType } from '../types';

export type ScreenType = 'login' | 'home' | 'diary' | 'group' | 'history';

interface AppContextProps {
  currentScreen: ScreenType;
  isLoggedIn: boolean;
  location: LocationData | null;
  selectedCondition: ConditionType;
  selectedSymptoms: string[];
  calYear: number;
  calMonth: number;
  toastMessage: string | null;
  navigate: (screen: ScreenType) => void;
  setLoggedIn: (loggedIn: boolean) => void;
  setLocation: (loc: LocationData | null) => void;
  setSelectedCondition: (cond: ConditionType) => void;
  setSelectedSymptoms: (symptoms: string[]) => void;
  setCalYear: (year: number) => void;
  setCalMonth: (month: number) => void;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('login');
  const [isSliding, setIsSliding] = useState<boolean>(false);
  const [isLoggedIn, setLoggedInState] = useState<boolean>(false);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<ConditionType>('normal');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [calYear, setCalYear] = useState<number>(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState<number>(new Date().getMonth());
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastTimeoutId, setToastTimeoutId] = useState<any | null>(null);

  const navigate = (screen: ScreenType) => {
    setCurrentScreen(screen);
  };

  const setLoggedIn = (loggedIn: boolean) => {
    setLoggedInState(loggedIn);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (toastTimeoutId) {
      clearTimeout(toastTimeoutId);
    }
    const timeoutId = setTimeout(() => {
      setToastMessage(null);
    }, 2500);
    setToastTimeoutId(timeoutId);
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        isLoggedIn,
        location,
        selectedCondition,
        selectedSymptoms,
        calYear,
        calMonth,
        toastMessage,
        navigate,
        setLoggedIn,
        setLocation,
        setSelectedCondition,
        setSelectedSymptoms,
        setCalYear,
        setCalMonth,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
