
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  first_name?: string;
  last_name?: string;
  birth_date?: string;
  phone_number?: string;
  address?: string;
  postal_code?: string;
  city?: string;
  country?: string;
  medical_access_code?: string;
  created_at?: string;
}

interface StableAuthContextType {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
}

const StableAuthContext = createContext<StableAuthContextType | undefined>(undefined);

export const StableAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Utiliser des refs pour éviter les changements d'état répétitifs
  const lastUserIdRef = useRef<string | null>(null);
  const profileLoadingRef = useRef<boolean>(false);
  const authListenerRef = useRef<any>(null);

  const loadProfile = async (userId: string) => {
    // Éviter les chargements de profil en parallèle
    if (profileLoadingRef.current || lastUserIdRef.current === userId) {
      return;
    }

    profileLoadingRef.current = true;
    lastUserIdRef.current = userId;

    try {
      console.log("Chargement du profil pour l'utilisateur:", userId);
      
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erreur lors du chargement du profil:', error);
        setProfile(null);
      } else {
        console.log("Profil chargé avec succès:", profileData);
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      setProfile(null);
    } finally {
      profileLoadingRef.current = false;
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      lastUserIdRef.current = null; // Force le rechargement
      await loadProfile(user.id);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log("Initialisation de l'authentification...");
        
        // Obtenir la session initiale
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erreur lors de la récupération de la session:', error);
        }

        if (mounted) {
          if (session?.user) {
            console.log("Session initiale trouvée:", session.user.id);
            setUser(session.user);
            setIsAuthenticated(true);
            await loadProfile(session.user.id);
          } else {
            console.log("Aucune session initiale trouvée");
            setUser(null);
            setProfile(null);
            setIsAuthenticated(false);
            lastUserIdRef.current = null;
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'authentification:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Configurer l'écouteur d'état d'authentification
    const setupAuthListener = () => {
      if (authListenerRef.current) {
        authListenerRef.current.subscription.unsubscribe();
      }

      authListenerRef.current = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return;

        console.log("Changement d'état d'authentification:", event, session?.user?.id);

        switch (event) {
          case 'SIGNED_IN':
            if (session?.user && session.user.id !== lastUserIdRef.current) {
              setUser(session.user);
              setIsAuthenticated(true);
              await loadProfile(session.user.id);
            }
            break;

          case 'SIGNED_OUT':
            setUser(null);
            setProfile(null);
            setIsAuthenticated(false);
            lastUserIdRef.current = null;
            break;

          case 'TOKEN_REFRESHED':
            // Ne pas recharger le profil lors du rafraîchissement du token
            if (session?.user) {
              setUser(session.user);
              setIsAuthenticated(true);
            }
            break;

          case 'INITIAL_SESSION':
            // Géré par initializeAuth
            break;

          default:
            console.log("Événement d'authentification non géré:", event);
        }
      });
    };

    initializeAuth();
    setupAuthListener();

    return () => {
      mounted = false;
      if (authListenerRef.current) {
        authListenerRef.current.subscription.unsubscribe();
      }
    };
  }, []);

  const value: StableAuthContextType = {
    user,
    profile,
    isAuthenticated,
    isLoading,
    refreshProfile
  };

  return (
    <StableAuthContext.Provider value={value}>
      {children}
    </StableAuthContext.Provider>
  );
};

export const useStableAuth = (): StableAuthContextType => {
  const context = useContext(StableAuthContext);
  if (context === undefined) {
    throw new Error('useStableAuth must be used within a StableAuthProvider');
  }
  return context;
};
