
import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { cleanupAuthState } from "@/utils/authUtils";

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  profile: any | null;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  signOut: async () => {},
  profile: null,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user profile - moved outside useEffect to prevent closure issues
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error("Error in profile fetch:", error);
    }
  };

  useEffect(() => {
    let mounted = true;
    console.log("Setting up auth state listener");
    setIsLoading(true);
    
    // Set up auth state listener FIRST before checking existing session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state change event:", event);
        
        if (!mounted) return;
        
        // Update authentication state immediately
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // If session exists, fetch profile with setTimeout to prevent deadlocks
        if (newSession?.user) {
          setTimeout(() => {
            if (mounted) {
              fetchProfile(newSession.user.id);
            }
          }, 0);
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );
    
    // THEN get initial session
    const initializeAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (data.session) {
          console.log("Initial session found");
          setSession(data.session);
          setUser(data.session.user);
          
          // Defer profile fetch with setTimeout to prevent deadlocks
          setTimeout(() => {
            if (mounted && data.session?.user?.id) {
              fetchProfile(data.session.user.id);
            }
          }, 0);
        } else {
          console.log("No initial session");
          setSession(null);
          setUser(null);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error getting initial session:", error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };
    
    initializeAuth();

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Sign out with improved clean up
  const signOut = async () => {
    try {
      setIsLoading(true);
      
      // Clean up auth state first to prevent inconsistent state
      cleanupAuthState();
      
      // Reset all auth state immediately
      setUser(null);
      setSession(null);
      setProfile(null);
      
      // Sign out from Supabase with global scope
      await supabase.auth.signOut({ scope: 'global' });
      
      // Navigate to login with a complete page reload for clean state
      window.location.href = "/auth";
    } catch (error) {
      console.error("Error during sign out:", error);
      // Even if there's an error, we should clean up and redirect
      cleanupAuthState();
      window.location.href = "/auth";
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated: !!user,
        signOut,
        profile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
