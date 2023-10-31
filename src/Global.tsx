import React, { Context, ReactNode, createContext, useContext, useState } from 'react';
import { NostrProfile, emptyNostrProfile } from './services/NostrHelper';

interface GlobalContextType {
  nostrProfile: NostrProfile | undefined;
  updateNostrProfile: (np: NostrProfile) => void;
}

const GlobalContext: Context<GlobalContextType | undefined> = createContext<
  GlobalContextType | undefined
>(undefined);

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider: React.FC<GlobalProviderProps> = ({
  children,
}: GlobalProviderProps) => {
  const [nostrProfile, setNostrProfile] = useState<NostrProfile>(emptyNostrProfile);

  const updateNostrProfile: (np: NostrProfile) => void = (np: NostrProfile) => {
    setNostrProfile(np);
  };

  return (
    <GlobalContext.Provider value={{ nostrProfile, updateNostrProfile }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext: () => GlobalContextType = () => {
  const context: GlobalContextType | undefined = useContext(GlobalContext);
  if (context === undefined) {
    console.error('useGlobauseGlobalContextlInteger must be used within a GlobalProvider');
    throw new Error('useGlobauseGlobalContextlInteger must be used within a GlobalProvider');
  }
  return context;
};
