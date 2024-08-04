import { Session } from '@supabase/supabase-js';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { supabase } from '~/lib/supabase';
interface authContexttype {
  userSession?: Session | null;
  isAuthenticated: boolean;
  userId?: string;
}

const AuthContext = createContext<authContexttype | null>({
  isAuthenticated: false,
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [userSession, setUserSession] = useState<Session | null>();
  const [isReady, setIsReady] = useState<boolean>(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserSession(session);
      setIsReady(true);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setUserSession(session);
    });
  }, []);

  if (!isReady) {
    return <ActivityIndicator />;
  }

  return (
    <AuthContext.Provider
      value={{ userSession, isAuthenticated: !!userSession?.user, userId: userSession?.user.id }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};
