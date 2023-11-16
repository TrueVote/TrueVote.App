import React, { Context, ReactNode, createContext, useContext, useState } from 'react';
import { LanguageLocalization } from './services/Language.localization';
import { NostrProfile, emptyNostrProfile } from './services/NostrHelper';

interface GlobalContextType {
  nostrProfile: NostrProfile | undefined;
  localization: LanguageLocalization | undefined;
  updateNostrProfile: (np: NostrProfile) => void;
  updateLocalization: (loc: LanguageLocalization) => void;
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
  const [localization, setLocalization] = useState<LanguageLocalization>();
  const updateNostrProfile: (np: NostrProfile) => void = (np: NostrProfile) => {
    setNostrProfile(np);
  };

  const updateLocalization: (loc: LanguageLocalization) => void = (loc: LanguageLocalization) => {
    setLocalization(loc);
  };

  return (
    <GlobalContext.Provider
      value={{ nostrProfile, updateNostrProfile, localization, updateLocalization }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext: () => GlobalContextType = () => {
  const context: GlobalContextType | undefined = useContext(GlobalContext);
  if (context === undefined) {
    console.error('useGlobalContext must be used within a GlobalProvider');
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }

  return context;
};
