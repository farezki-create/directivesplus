
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { cleanupAuthState, performGlobalSignOut } from '@/utils/authUtils';

export interface Profile {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  birth_date?: string;
  phone_number?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback(async (userId: string) => {
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        return;
      }

      if (profileData) {
        // Add the user's email to the profile data since it's not stored in the profiles table
        const profileWithEmail = {
          ...profileData,
          email: user?.email || ""
        };
        setProfile(profileWithEmail);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }, [user?.email]);

  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      await loadProfile(user.id);
    }
  }, [user?.id, loadProfile]);

  const signOut = useCallback(async () => {
    try {
      console.log("🔴 === AuthContext: DÉBUT DÉCONNEXION === 🔴");
      
      // Nettoyer l'état local immédiatement
      setUser(null);
      setSession(null);
      setProfile(null);
      
      // Effectuer une déconnexion complète
      await performGlobalSignOut();
      
      console.log("🚀 AuthContext: REDIRECTION VERS /auth");
      window.location.href = '/auth';
    } catch (error) {
      console.error('❌ AuthContext: Erreur lors de la déconnexion:', error);
      // Même en cas d'erreur, forcer la redirection
      window.location.href = '/auth';
    }
  }, []);

  useEffect(() => {
    console.log("🔄 AuthContext: Initialisation des listeners d'authentification");
    
    // Configuration du listener d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Déférer le chargement du profil pour éviter les deadlocks
          setTimeout(() => {
            loadProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    // Vérification de session initiale
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔍 Session initiale:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        loadProfile(session.user.id);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const value: AuthContextType = {
    user,
    session,
    profile,
    isAuthenticated: !!user && !!session,
    isLoading,
    signOut,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
