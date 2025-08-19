'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type UserType = 'business' | 'individual';

interface UserTypeContextType {
  userType: UserType;
  setUserType: (type: UserType) => void;
  isTransitioning: boolean;
  setIsTransitioning: (transitioning: boolean) => void;
}

const UserTypeContext = createContext<UserTypeContextType | undefined>(undefined);

export function UserTypeProvider({ children }: { children: ReactNode }) {
  const [userType, setUserType] = useState<UserType>('business');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleUserTypeChange = (type: UserType) => {
    if (type !== userType) {
      setIsTransitioning(true);
      setTimeout(() => {
        setUserType(type);
        setTimeout(() => setIsTransitioning(false), 100);
      }, 300);
    }
  };

  return (
    <UserTypeContext.Provider value={{
      userType,
      setUserType: handleUserTypeChange,
      isTransitioning,
      setIsTransitioning
    }}>
      {children}
    </UserTypeContext.Provider>
  );
}

export function useUserType() {
  const context = useContext(UserTypeContext);
  if (context === undefined) {
    throw new Error('useUserType must be used within a UserTypeProvider');
  }
  return context;
}
