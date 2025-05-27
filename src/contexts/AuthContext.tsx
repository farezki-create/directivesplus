
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
  
  const initialized = useRef(false);
  const profileCache = useRef<Map<string, Profile>>(new Map());

  const loadProfile = useCallback(async (userId: string) => {
    // Utiliser le cache si disponible
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
        console.log("Profile data loaded successfully");
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
    console.log("=== DÉBUT DU PROCESSUS DE DÉCONNEXION ===");
    
    try {
      // 1. Nettoyage immédiat de l'état local AVANT tout
      console.log("1. Nettoyage de l'état local...");
      setIsLoading(true);
      profileCache.current.clear();
      setProfile(null);
      setUser(null);
      setSession(null);
      
      // 2. Nettoyage du stockage navigateur
      console.log("2. Nettoyage du stockage...");
      cleanupAuthState();
      
      // 3. Tentative de déconnexion Supabase (mais on continue même si ça échoue)
      console.log("3. Déconnexion Supabase...");
      try {
        await supabase.auth.signOut({ scope: 'global' });
        console.log("Déconnexion Supabase réussie");
      } catch (supabaseError) {
        console.error('Erreur Supabase (on continue quand même):', supabaseError);
      }
      
      // 4. Nettoyage final et redirection forcée
      console.log("4. Redirection forcée...");
      cleanupAuthState(); // Double nettoyage pour être sûr
      
      // Forcer le rechargement complet de la page vers /auth
      console.log("=== FIN DU PROCESSUS - REDIRECTION ===");
      window.location.replace('/auth');
      
    } catch (error) {
      console.error('Erreur durant la déconnexion:', error);
      
      // En cas d'erreur, forcer quand même la déconnexion locale
      cleanupAuthState();
      setProfile(null);
      setUser(null);
      setSession(null);
      profileCache.current.clear();
      
      // Redirection forcée même en cas d'erreur
      window.location.replace('/auth');
    }
  }, []);

  // Initialisation simplifiée
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    console.log("Initializing auth state...");
    
    // Configuration du listener d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        
        if (event === 'SIGNED_OUT' || !session) {
          console.log("Event SIGNED_OUT détecté - nettoyage complet");
          cleanupAuthState();
          setSession(null);
          setUser(null);
          setProfile(null);
          profileCache.current.clear();
        } else if (session?.user) {
          setSession(session);
          setUser(session.user);
          
          // Charger le profil de manière différée
          setTimeout(() => {
            loadProfile(session.user.id);
          }, 0);
        }
        
        setIsLoading(false);
      }
    );

    // Vérification de session initiale simplifiée
    supabase.auth.getSession().then(({ data: { session: initialSession }, error }) => {
      if (error) {
        console.error('Error checking initial session:', error);
        cleanupAuthState();
      } else if (initialSession?.user) {
        // Validation basique de la session
        const now = Date.now() / 1000;
        if (initialSession.expires_at && initialSession.expires_at > now) {
          console.log("Valid initial session found");
          setSession(initialSession);
          setUser(initialSession.user);
          
          setTimeout(() => {
            loadProfile(initialSession.user.id);
          }, 0);
        } else {
          console.log("Session expired, cleaning up");
          cleanupAuthState();
          supabase.auth.signOut();
        }
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
