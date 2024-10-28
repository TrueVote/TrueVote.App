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
  isInitialized: boolean;
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
  const [isInitialized, setIsInitialized] = useState(false);
  const [nostrProfile, setNostrProfile] = useState<NostrProfile>(emptyNostrProfile);
  const [userModel, setUserModel] = useState<UserModel>(emptyUserModel);
  const [localization, setLocalization] = useState<Localization>(() => new Localization());
  const [accessCodes, setAccessCodes] = useState<string[]>(() => {
    const savedCodes = localStorage.getItem('accessCodes');
    return savedCodes ? JSON.parse(savedCodes) : [];
  });

  // Initialize state from localStorage and any other necessary sources
  useEffect(() => {
    const initializeState = async (): Promise<void> => {
      try {
        // Load access codes (already handled in useState above)

        // Load user model if it exists
        const storedUser = localStorage.getItem('userModel');
        if (storedUser) {
          setUserModel(JSON.parse(storedUser));
        }

        // Load nostr profile if it exists
        const storedNostrProfile = localStorage.getItem('nostrProfile');
        if (storedNostrProfile) {
          setNostrProfile(JSON.parse(storedNostrProfile));
        }

        // Add any other initialization logic here
      } catch (error) {
        console.error('Failed to initialize state:', error);
      } finally {
        if (localization?.isInitialized()) {
          setIsInitialized(true);
        }
      }
    };

    initializeState();
  }, [localization]);

  // Persist access codes
  useEffect(() => {
    localStorage.setItem('accessCodes', JSON.stringify(accessCodes));
  }, [accessCodes]);

  // Persist user model
  useEffect(() => {
    if (userModel !== emptyUserModel) {
      localStorage.setItem('userModel', JSON.stringify(userModel));
    }
  }, [userModel]);

  // Persist nostr profile
  useEffect(() => {
    if (nostrProfile !== emptyNostrProfile) {
      localStorage.setItem('nostrProfile', JSON.stringify(nostrProfile));
    }
  }, [nostrProfile]);

  const updateNostrProfile: (np: NostrProfile) => void = (np: NostrProfile) => {
    setNostrProfile(np);
  };

  const updateUserModel: (um: UserModel) => void = (um: UserModel) => {
    if (um === emptyUserModel) {
      localStorage.removeItem('userModel');
      localStorage.removeItem('accessCodes');
      localStorage.removeItem('ballotBinders');
      localStorage.removeItem('nostrProfile');
    }
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
        isInitialized,
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
