
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
    console.log("🚨 DÉBUT DU PROCESSUS DE DÉCONNEXION FORCÉE 🚨");
    
    try {
      // 1. ARRÊT IMMÉDIAT - Marquer comme en cours de déconnexion
      console.log("1. 🛑 Arrêt immédiat de l'état d'authentification");
      setIsLoading(true);
      
      // 2. NETTOYAGE LOCAL IMMÉDIAT ET BRUTAL
      console.log("2. 🧹 Nettoyage local brutal");
      setUser(null);
      setSession(null);
      setProfile(null);
      profileCache.current.clear();
      
      // 3. NETTOYAGE DU STOCKAGE AVANT MÊME D'ESSAYER SUPABASE
      console.log("3. 💾 Nettoyage du stockage navigateur");
      cleanupAuthState();
      
      // 4. FORCER LA DÉCONNEXION SUPABASE (sans attendre le résultat)
      console.log("4. ☁️ Tentative de déconnexion Supabase");
      supabase.auth.signOut({ scope: 'global' }).catch((error) => {
        console.warn("Erreur Supabase ignorée:", error);
      });
      
      // 5. DOUBLE NETTOYAGE POUR ÊTRE SÛR
      console.log("5. 🔄 Double nettoyage sécurisé");
      cleanupAuthState();
      
      // 6. REDIRECTION IMMÉDIATE ET FORCÉE
      console.log("6. 🚀 REDIRECTION FORCÉE IMMÉDIATE");
      setTimeout(() => {
        window.location.href = '/auth';
      }, 100); // Petit délai pour que les logs s'affichent
      
    } catch (error) {
      console.error('❌ Erreur critique durant la déconnexion:', error);
      
      // EN CAS D'ERREUR CRITIQUE : FORCER QUAND MÊME
      console.log("🚨 FORÇAGE EN CAS D'ERREUR");
      cleanupAuthState();
      setUser(null);
      setSession(null);
      setProfile(null);
      profileCache.current.clear();
      
      // Redirection forcée même en cas d'erreur critique
      window.location.href = '/auth';
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
          console.log("🔥 Event SIGNED_OUT détecté - nettoyage complet immédiat");
          cleanupAuthState();
          setSession(null);
          setUser(null);
          setProfile(null);
          profileCache.current.clear();
          setIsLoading(false);
          
          // Redirection immédiate vers auth si on n'y est pas déjà
          if (window.location.pathname !== '/auth') {
            console.log("🚀 Redirection auto vers /auth");
            window.location.href = '/auth';
          }
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
