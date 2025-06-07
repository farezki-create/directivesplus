
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { cleanupAuthState } from '@/utils/authUtils';

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
        console.error('❌ Erreur chargement profil:', error);
        return;
      }

      if (profileData) {
        setProfile(profileData);
        console.log('✅ Profil chargé:', profileData.email);
      }
    } catch (error) {
      console.error('❌ Erreur chargement profil:', error);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      await loadProfile(user.id);
    }
  }, [user?.id, loadProfile]);

  const signOut = useCallback(async () => {
    console.log('🔴 === AuthContext: DÉBUT DÉCONNEXION === 🔴');
    
    try {
      // 1. Nettoyer l'état local immédiatement
      setUser(null);
      setSession(null);
      setProfile(null);
      
      // 2. Nettoyer le stockage
      cleanupAuthState();
      
      // 3. Déconnexion Supabase (sans bloquer si erreur)
      try {
        await supabase.auth.signOut({ scope: 'global' });
        console.log('✅ Déconnexion Supabase réussie');
      } catch (authError) {
        console.warn('⚠️ Erreur déconnexion Supabase (ignorée):', authError);
      }
      
      // 4. Redirection forcée
      console.log('🚀 Redirection vers /auth');
      window.location.href = '/auth';
      
    } catch (error) {
      console.error('❌ Erreur générale déconnexion:', error);
      // Même en cas d'erreur, forcer la redirection
      window.location.href = '/auth';
    }
  }, []);

  useEffect(() => {
    console.log('🔐 Initialisation AuthContext');
    
    // Configuration du listener d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('✅ Utilisateur connecté:', session.user.email);
          // Différer le chargement du profil pour éviter les blocages
          setTimeout(() => {
            loadProfile(session.user.id);
          }, 100);
        } else {
          console.log('❌ Aucun utilisateur connecté');
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    // Vérification de session initiale
    const checkInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Erreur récupération session:', error);
          cleanupAuthState();
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('✅ Session existante trouvée:', session.user.email);
          setTimeout(() => {
            loadProfile(session.user.id);
          }, 100);
        }
      } catch (error) {
        console.error('❌ Erreur vérification session:', error);
        cleanupAuthState();
      } finally {
        setIsLoading(false);
      }
    };

    checkInitialSession();

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
