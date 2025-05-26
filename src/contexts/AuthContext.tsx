import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
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
  
  // Cache pour éviter les appels redondants
  const profileCache = useRef<Map<string, Profile>>(new Map());
  const loadingProfile = useRef<Set<string>>(new Set());

  const loadProfile = useCallback(async (userId: string) => {
    // Éviter les appels multiples simultanés
    if (loadingProfile.current.has(userId)) {
      console.log("Profile loading already in progress for user:", userId);
      return;
    }

    // Vérifier le cache d'abord
    const cachedProfile = profileCache.current.get(userId);
    if (cachedProfile) {
      console.log("Using cached profile for user:", userId);
      setProfile(cachedProfile);
      return;
    }

    try {
      loadingProfile.current.add(userId);
      console.log("Loading profile data for user:", userId);

      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        return;
      }

      if (profileData) {
        console.log("Profile data loaded:", profileData);
        // Mettre en cache
        profileCache.current.set(userId, profileData);
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      loadingProfile.current.delete(userId);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      // Invalider le cache
      profileCache.current.delete(user.id);
      await loadProfile(user.id);
    }
  }, [user?.id, loadProfile]);

  const signOut = useCallback(async () => {
    try {
      // Nettoyer le cache
      profileCache.current.clear();
      loadingProfile.current.clear();
      
      setIsLoading(true);
      await supabase.auth.signOut();
      
      // Les états seront mis à jour par l'auth state listener
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log("Setting up auth state listener");
    
    let mounted = true;

    // Configuration du listener d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log("Auth state changed:", event, session?.user?.id);
        
        // Mettre à jour la session et l'utilisateur
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          console.log("User signed in, updating state");
          // Charger le profil seulement si l'utilisateur est connecté
          await loadProfile(session.user.id);
        } else {
          console.log("User signed out, clearing state");
          // Nettoyer l'état quand l'utilisateur se déconnecte
          setProfile(null);
          profileCache.current.clear();
          loadingProfile.current.clear();
        }
        
        setIsLoading(false);
      }
    );

    // Vérifier la session initiale une seule fois
    const checkInitialSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        console.log("Initial session check:", initialSession?.user?.id);
        
        if (initialSession?.user) {
          setSession(initialSession);
          setUser(initialSession.user);
          await loadProfile(initialSession.user.id);
        }
      } catch (error) {
        console.error('Error checking initial session:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    checkInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const value: AuthContextType = {
    user,
    session,
    profile,
    isAuthenticated: !!user,
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
