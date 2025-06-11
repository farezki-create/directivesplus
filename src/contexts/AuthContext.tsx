
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

  // Function to fetch user profile
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('🔍 [AUTH-CONTEXT] Récupération profil pour utilisateur:', userId);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ [AUTH-CONTEXT] Erreur récupération profil:', error);
        setProfile(null);
      } else {
        console.log('✅ [AUTH-CONTEXT] Profil récupéré:', data);
        setProfile(data);
      }
    } catch (error) {
      console.error('❌ [AUTH-CONTEXT] Erreur inattendue récupération profil:', error);
      setProfile(null);
    }
  };

  useEffect(() => {
    console.log('🔄 [AUTH-CONTEXT] Initialisation des listeners d\'authentification');

    // Configuration du listener d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 [AUTH-CONTEXT] Auth state changed:', event, session?.user?.id || 'no user');
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch profile when user is authenticated
        if (session?.user?.id) {
          // Use setTimeout to defer the profile fetch and prevent auth state callback deadlock
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    // Récupération de la session initiale
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('🔍 [AUTH-CONTEXT] Session initiale:', session?.user?.id || 'aucune session');
        
        if (error) {
          console.error('❌ [AUTH-CONTEXT] Erreur lors de la récupération de la session:', error);
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch profile for initial session
        if (session?.user?.id) {
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('❌ [AUTH-CONTEXT] Erreur inattendue lors de la récupération de la session:', error);
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
      console.log('🚪 [AUTH-CONTEXT] Déconnexion en cours...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ [AUTH-CONTEXT] Erreur lors de la déconnexion:', error);
        throw error;
      }
      
      // Clear profile on logout
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
