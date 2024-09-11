/* eslint-disable no-unused-vars */
import { UserModel } from '@/TrueVote.Api';
import React, { Context, ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { Localization } from './services/Localization';
import { NostrProfile, emptyNostrProfile } from './services/NostrHelper';

export const emptyUserModel: UserModel = {
  UserId: '',
  NostrPubKey: '',
  FullName: '',
  Email: '',
  DateCreated: '',
  DateUpdated: '',
  UserPreferences: {
    NotificationElectionEnd: false,
    NotificationElectionStart: false,
    NotificationNewElections: false,
    NotificationNewTrueVoteFeatures: false,
  },
};

interface GlobalContextType {
  nostrProfile: NostrProfile | undefined;
  userModel: UserModel | undefined;
  localization: Localization | undefined;
  accessCodes: string[] | undefined;
  updateNostrProfile: (np: NostrProfile) => void;
  updateUserModel: (ui: UserModel) => void;
  updateLocalization: (loc: Localization) => void;
  updateAccessCodes: (ac: string[]) => void;
  addAccessCode: (ac: string) => void;
  removeAccessCode: (ac: string) => void;
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
  const [userModel, setUserModel] = useState<UserModel>(emptyUserModel);
  const [localization, setLocalization] = useState<Localization>();
  const [accessCodes, setAccessCodes] = useState<string[]>(() => {
    const savedCodes = localStorage.getItem('accessCodes');
    return savedCodes ? JSON.parse(savedCodes) : [];
  });
  useEffect(() => {
    localStorage.setItem('accessCodes', JSON.stringify(accessCodes));
  }, [accessCodes]);

  const updateNostrProfile: (np: NostrProfile) => void = (np: NostrProfile) => {
    setNostrProfile(np);
  };

  const updateUserModel: (um: UserModel) => void = (um: UserModel) => {
    setUserModel(um);
  };

  const updateLocalization: (loc: Localization) => void = (loc: Localization) => {
    setLocalization(loc);
  };

  const updateAccessCodes: (ac: string[]) => void = (ac: string[]) => {
    setAccessCodes(ac);
  };

  const addAccessCode = (ac: string): void => {
    setAccessCodes((prevCodes) => {
      if (!prevCodes.includes(ac)) {
        console.info('addAccessCode()', prevCodes, ac);
        return [...prevCodes, ac];
      }
      return prevCodes;
    });
  };

  const removeAccessCode = (ac: string): void => {
    setAccessCodes((prevCodes) => {
      const updatedCodes = prevCodes.filter((code) => code !== ac);
      console.info('removeAccessCode()', prevCodes, ac);
      return updatedCodes;
    });
  };

  return (
    <GlobalContext.Provider
      value={{
        nostrProfile,
        updateNostrProfile,
        userModel,
        updateUserModel,
        localization,
        updateLocalization,
        accessCodes,
        updateAccessCodes,
        addAccessCode,
        removeAccessCode,
      }}
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
