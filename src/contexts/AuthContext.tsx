
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
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ [AUTH-CONTEXT] Erreur récupération profil:', error);
        setProfile(null);
      } else if (data) {
        setProfile(data);
      } else {
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
        const { data, error } = await supabase.rpc('has_role', {
          _user_id: user.id,
          _role: 'admin'
        });
        
        if (error) {
          console.error('❌ [AUTH-CONTEXT] Erreur vérification rôle admin:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(!!data);
        }
      } else {
        setIsAdmin(false);
      }
    };
    
    checkAdminRole();
  }, [user?.id]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user?.id) {
          HDSSessionManager.setSessionStartTime();
          HDSSessionManager.initializeHDSSession();
          
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 100);
        } else {
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
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user?.id) {
          HDSSessionManager.setSessionStartTime();
          HDSSessionManager.initializeHDSSession();
          
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
      HDSSessionManager.destroy();
    };
  }, []);

  // Vérification périodique de la validité de session HDS
  useEffect(() => {
    if (!user) return;

    const sessionCheckInterval = setInterval(() => {
      const isValid = HDSSessionManager.isSessionValid();
      if (!isValid) {
        signOut();
      }
    }, 60000);

    return () => clearInterval(sessionCheckInterval);
  }, [user]);

  const signOut = async () => {
    try {
      HDSSessionManager.destroy();
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ [AUTH-CONTEXT] Erreur déconnexion:', error);
        throw error;
      }
      
      setProfile(null);
    } catch (error) {
      console.error('❌ [AUTH-CONTEXT] Erreur de déconnexion:', error);
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
