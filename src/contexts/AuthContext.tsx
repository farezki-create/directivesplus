
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { HDSSessionManager } from '@/utils/security/hdsSessionManager';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  profile: any | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('🔍 [AUTH-CONTEXT] Récupération profil pour utilisateur:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ [AUTH-CONTEXT] Erreur récupération profil:', error);
        setProfile(null);
      } else if (data) {
        console.log('✅ [AUTH-CONTEXT] Profil récupéré:', data);
        setProfile(data);
      } else {
        console.log('ℹ️ [AUTH-CONTEXT] Aucun profil trouvé pour cet utilisateur');
        setProfile(null);
      }
    } catch (error) {
      console.error('❌ [AUTH-CONTEXT] Erreur inattendue récupération profil:', error);
      setProfile(null);
    }
  };

  // Check admin role from database (server-side validation)
  useEffect(() => {
    const checkAdminRole = async () => {
      if (user?.id) {
        console.log('🔐 [AUTH-CONTEXT] Vérification rôle admin côté serveur pour:', user.id);
        const { data, error } = await supabase.rpc('has_role', {
          _user_id: user.id,
          _role: 'admin'
        });
        
        if (error) {
          console.error('❌ [AUTH-CONTEXT] Erreur vérification rôle admin:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(!!data);
          console.log('✅ [AUTH-CONTEXT] Rôle admin vérifié:', !!data);
        }
      } else {
        setIsAdmin(false);
      }
    };
    
    checkAdminRole();
  }, [user?.id]);

  useEffect(() => {
    console.log('🔄 [AUTH-CONTEXT] Initialisation AuthContext avec gestion HDS');

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 [AUTH-CONTEXT] Auth state changed:', event, session?.user?.id || 'no user');
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user?.id) {
          // Initialiser la session HDS pour les utilisateurs authentifiés
          HDSSessionManager.setSessionStartTime();
          HDSSessionManager.initializeHDSSession();
          console.log("🏥 Session HDS initialisée - Timeout: 8h, Auto-lock: 30min");
          
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 100);
        } else {
          // Nettoyer la session HDS lors de la déconnexion
          HDSSessionManager.destroy();
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ [AUTH-CONTEXT] Erreur session initiale:', error);
        }
        
        console.log('🔍 [AUTH-CONTEXT] Session initiale:', session?.user?.id || 'aucune session');
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user?.id) {
          // Initialiser la session HDS dès le démarrage si utilisateur connecté
          HDSSessionManager.setSessionStartTime();
          HDSSessionManager.initializeHDSSession();
          console.log("🏥 Session HDS initialisée au démarrage");
          
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('❌ [AUTH-CONTEXT] Erreur inattendue session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    return () => {
      subscription.unsubscribe();
      // Nettoyer la session HDS au démontage du contexte
      HDSSessionManager.destroy();
    };
  }, []);

  // Vérification périodique de la validité de session HDS
  useEffect(() => {
    if (!user) return;

    const sessionCheckInterval = setInterval(() => {
      const isValid = HDSSessionManager.isSessionValid();
      if (!isValid) {
        console.log("❌ Session HDS expirée - déconnexion automatique");
        signOut();
      }
    }, 60000); // Vérifier toutes les minutes

    return () => clearInterval(sessionCheckInterval);
  }, [user]);

  const signOut = async () => {
    try {
      console.log('🚪 [AUTH-CONTEXT] Déconnexion avec nettoyage HDS...');
      
      // Nettoyer la session HDS avant la déconnexion Supabase
      HDSSessionManager.destroy();
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ [AUTH-CONTEXT] Erreur déconnexion:', error);
        throw error;
      }
      
      setProfile(null);
      console.log('✅ [AUTH-CONTEXT] Déconnexion réussie avec nettoyage HDS');
    } catch (error) {
      console.error('❌ [AUTH-CONTEXT] Erreur de déconnexion:', error);
      // Forcer le nettoyage même en cas d'erreur
      HDSSessionManager.destroy();
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isAuthenticated: !!user,
    isLoading,
    isAdmin,
    signOut,
    profile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
