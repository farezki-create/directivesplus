
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
    console.log("🚨 === DÉBUT DU PROCESSUS DE DÉCONNEXION RADICALE === 🚨");
    
    try {
      // 1. ARRÊT IMMÉDIAT ET BRUTAL
      console.log("1. 🛑 ARRÊT IMMÉDIAT - Suppression de tous les états");
      
      // 2. NETTOYAGE LOCAL IMMÉDIAT ET BRUTAL - AVANT TOUT
      console.log("2. 🧹 NETTOYAGE LOCAL BRUTAL IMMÉDIAT");
      setIsLoading(true);
      setUser(null);
      setSession(null);
      setProfile(null);
      profileCache.current.clear();
      
      // 3. NETTOYAGE DU STOCKAGE - TRIPLE NETTOYAGE
      console.log("3. 💾 TRIPLE NETTOYAGE DU STOCKAGE");
      cleanupAuthState();
      
      // Nettoyage supplémentaire ultra agressif
      try {
        localStorage.clear();
        sessionStorage.clear();
        console.log("💾 Storage complètement vidé");
      } catch (e) {
        console.warn("Erreur lors du nettoyage du storage:", e);
      }
      
      // 4. FORCER LA DÉCONNEXION SUPABASE SANS ATTENDRE
      console.log("4. ☁️ DÉCONNEXION SUPABASE FORCÉE");
      setTimeout(() => {
        supabase.auth.signOut({ scope: 'global' }).catch((error) => {
          console.warn("Erreur Supabase ignorée:", error);
        });
      }, 0);
      
      // 5. REDIRECTION IMMÉDIATE ET RADICALE
      console.log("5. 🚀 REDIRECTION RADICALE VERS /auth");
      
      // Supprimer tous les écouteurs d'événements potentiels
      window.removeEventListener('beforeunload', () => {});
      
      // Redirection immédiate avec replace pour éviter l'historique
      window.location.replace('/auth');
      
    } catch (error) {
      console.error('❌ ERREUR CRITIQUE - REDIRECTION DE SECOURS:', error);
      
      // REDIRECTION DE SECOURS RADICALE
      cleanupAuthState();
      localStorage.clear();
      sessionStorage.clear();
      setUser(null);
      setSession(null);
      setProfile(null);
      profileCache.current.clear();
      
      // Redirection de secours
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
          console.log("🔥 Event SIGNED_OUT détecté - nettoyage immédiat");
          setSession(null);
          setUser(null);
          setProfile(null);
          profileCache.current.clear();
          setIsLoading(false);
          // PAS de redirection automatique ici - on laisse signOut() gérer ça
        } else if (session?.user) {
          console.log("✅ Utilisateur connecté:", session.user.id);
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
