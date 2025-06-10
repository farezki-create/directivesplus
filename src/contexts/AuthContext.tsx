
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
      console.log('🔍 Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Error fetching profile:', error);
        // Don't throw error, just set profile to null
        setProfile(null);
      } else {
        console.log('✅ Profile fetched:', data);
        setProfile(data);
      }
    } catch (error) {
      console.error('❌ Unexpected error fetching profile:', error);
      setProfile(null);
    }
  };

  useEffect(() => {
    console.log('🔄 AuthContext: Initialisation des listeners d\'authentification');

    // Configuration du listener d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.id || 'no user');
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch profile when user is authenticated
        if (session?.user?.id) {
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
        console.log('🔍 Session initiale:', session?.user?.id || 'aucune session');
        
        if (error) {
          console.error('❌ Erreur lors de la récupération de la session:', error);
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch profile for initial session
        if (session?.user?.id) {
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('❌ Erreur inattendue lors de la récupération de la session:', error);
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
      console.log('🚪 Déconnexion en cours...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Erreur lors de la déconnexion:', error);
        throw error;
      }
      
      // Clear profile on logout
      setProfile(null);
      console.log('✅ Déconnexion réussie');
    } catch (error) {
      console.error('❌ Erreur de déconnexion:', error);
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
