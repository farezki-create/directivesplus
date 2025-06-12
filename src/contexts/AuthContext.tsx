
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
  profile: any | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('🔍 [AUTH-CONTEXT] Récupération profil pour utilisateur:', userId);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ [AUTH-CONTEXT] Erreur récupération profil:', error);
        setProfile(null);
      } else if (data) {
        console.log('✅ [AUTH-CONTEXT] Profil récupéré:', data);
        setProfile(data);
      } else {
        console.log('ℹ️ [AUTH-CONTEXT] Aucun profil trouvé pour cet utilisateur');
        setProfile(null);
      }
    } catch (error) {
      console.error('❌ [AUTH-CONTEXT] Erreur inattendue récupération profil:', error);
      setProfile(null);
    }
  };

  useEffect(() => {
    console.log('🔄 [AUTH-CONTEXT] Initialisation AuthContext simplifié');

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 [AUTH-CONTEXT] Auth state changed:', event, session?.user?.id || 'no user');
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user?.id) {
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 100);
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ [AUTH-CONTEXT] Erreur session initiale:', error);
        }
        
        console.log('🔍 [AUTH-CONTEXT] Session initiale:', session?.user?.id || 'aucune session');
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user?.id) {
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('❌ [AUTH-CONTEXT] Erreur inattendue session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      console.log('🚪 [AUTH-CONTEXT] Déconnexion...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ [AUTH-CONTEXT] Erreur déconnexion:', error);
        throw error;
      }
      
      setProfile(null);
      console.log('✅ [AUTH-CONTEXT] Déconnexion réussie');
    } catch (error) {
      console.error('❌ [AUTH-CONTEXT] Erreur de déconnexion:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isAuthenticated: !!user,
    isLoading,
    signOut,
    profile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
