
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

  const loadProfile = useCallback(async (userId: string) => {
    // Vérifier le cache d'abord
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
      profileCache.current.clear();
      setIsLoading(true);
      await supabase.auth.signOut();
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
        
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          console.log("User signed in, loading profile");
          setTimeout(() => {
            loadProfile(session.user.id);
          }, 0);
        } else {
          console.log("User signed out, clearing state");
          setProfile(null);
          profileCache.current.clear();
        }
        
        setIsLoading(false);
      }
    );

    // Vérifier la session initiale
    const checkInitialSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        console.log("Initial session check:", initialSession?.user?.id);
        
        if (initialSession?.user) {
          setSession(initialSession);
          setUser(initialSession.user);
          setTimeout(() => {
            loadProfile(initialSession.user.id);
          }, 0);
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
