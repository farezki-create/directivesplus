
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

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
        // Assigner l'email depuis l'utilisateur si pas dans le profil
        const profileWithEmail = {
          ...profileData,
          email: profileData.email || user?.email
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
    console.log("🔴 === AuthContext: DÉCONNEXION INITIÉE === 🔴");
    
    try {
      // Nettoyer l'état local immédiatement
      setUser(null);
      setSession(null);
      setProfile(null);
      
      // Nettoyer le localStorage
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      console.log("🧹 État local nettoyé");
      
      // Tentative de déconnexion avec Supabase
      await supabase.auth.signOut({ scope: 'global' });
      console.log("✅ Déconnexion Supabase réussie");
      
      // Redirection forcée
      console.log("🔄 Redirection vers /auth");
      window.location.href = '/auth';
      
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion:', error);
      // Même en cas d'erreur, forcer la redirection
      console.log("🚨 Redirection de secours");
      window.location.href = '/auth';
    }
  }, []);

  useEffect(() => {
    console.log("🔐 Initialisation AuthContext");
    
    // Configuration du listener d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log("✅ Utilisateur connecté:", session.user.email);
          setTimeout(() => {
            loadProfile(session.user.id);
          }, 0);
        } else {
          console.log("❌ Utilisateur déconnecté");
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    // Vérification de session initiale
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        console.log("✅ Session existante trouvée:", session.user.email);
      }
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
