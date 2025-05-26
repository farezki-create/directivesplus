
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
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
  role?: string;
  roles?: string[];
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
  
  const hasInitialized = useRef(false);
  const profileCache = useRef<Map<string, Profile>>(new Map());

  const loadProfile = useCallback(async (userId: string) => {
    const cachedProfile = profileCache.current.get(userId);
    if (cachedProfile) {
      console.log("Using cached profile for user:", userId);
      setProfile(cachedProfile);
      return;
    }

    try {
      console.log("Loading profile data for user:", userId);

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
        console.log("Profile data loaded:", profileData);
        profileCache.current.set(userId, profileData);
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      profileCache.current.delete(user.id);
      await loadProfile(user.id);
    }
  }, [user?.id, loadProfile]);

  const signOut = useCallback(async () => {
    try {
      console.log("Initiating secure sign out...");
      
      // Nettoyer immédiatement le cache et l'état local
      profileCache.current.clear();
      setProfile(null);
      setUser(null);
      setSession(null);
      setIsLoading(true);
      
      // Nettoyer l'état d'authentification local
      cleanupAuthState();
      
      // Déconnexion globale via Supabase
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) {
        console.error('Error during sign out:', error);
        // Continuer même en cas d'erreur pour assurer la déconnexion locale
      }
      
      // Log de sécurité
      console.log("User signed out successfully");
      
      // Redirection avec nettoyage complet
      setTimeout(() => {
        window.location.href = '/auth';
      }, 100);
      
    } catch (error) {
      console.error('Error signing out:', error);
      
      // En cas d'erreur, forcer quand même la déconnexion locale
      cleanupAuthState();
      setProfile(null);
      setUser(null);
      setSession(null);
      
      // Redirection forcée
      window.location.href = '/auth';
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    console.log("Setting up secure auth state listener");
    
    // Configuration du listener d'état d'authentification avec sécurité renforcée
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        
        // Gestion sécurisée des événements d'authentification
        if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED' && !session) {
          console.log("User signed out, cleaning state");
          cleanupAuthState();
          setSession(null);
          setUser(null);
          setProfile(null);
          profileCache.current.clear();
        } else if (session?.user) {
          console.log("User authenticated, setting session");
          setSession(session);
          setUser(session.user);
          
          // Charger le profil de manière asynchrone pour éviter les blocages
          setTimeout(() => {
            loadProfile(session.user.id);
          }, 0);
        } else {
          console.log("No valid session, clearing state");
          setSession(null);
          setUser(null);
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    // Vérifier la session initiale avec sécurité
    const checkInitialSession = async () => {
      try {
        console.log("Checking initial session with security validation...");
        
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking initial session:', error);
          cleanupAuthState();
          setIsLoading(false);
          return;
        }
        
        console.log("Initial session check:", initialSession?.user?.id);
        
        if (initialSession?.user) {
          // Valider l'intégrité de la session
          const now = Date.now() / 1000;
          if (initialSession.expires_at && initialSession.expires_at < now) {
            console.log("Session expired, cleaning up");
            cleanupAuthState();
            await supabase.auth.signOut();
            setIsLoading(false);
            return;
          }
          
          setSession(initialSession);
          setUser(initialSession.user);
          
          // Charger le profil de manière asynchrone
          setTimeout(() => {
            loadProfile(initialSession.user.id);
          }, 0);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking initial session:', error);
        cleanupAuthState();
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
