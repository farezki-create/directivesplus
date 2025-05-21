
import React, { createContext, useState, useEffect, useContext } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { cleanupAuthState, fetchUserProfile, safeNavigate } from "@/utils/authUtils";
import { AuthContextProps, AuthProviderProps, AuthEvent } from "./AuthContextTypes";

const AuthContext = createContext<AuthContextProps>({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  signOut: async () => {},
  profile: null,
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Setting up auth state listener");
    let isMounted = true;
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthEvent, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.id);
        
        if (!isMounted) return;
        
        // Process the auth event
        handleAuthEvent(event, currentSession);
        
        // Update state with new auth information
        setUser(currentSession?.user ?? null);
        setSession(currentSession);
        setIsLoading(false);

        // Only fetch profile if we have a user and using setTimeout to avoid potential auth deadlocks
        if (currentSession?.user) {
          console.log("Auth state change: Fetching profile for user", currentSession.user.id);
          setTimeout(() => {
            if (isMounted) loadUserProfile(currentSession.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // Then get initial session
    const initSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        console.log("Initial session check:", initialSession?.user?.id || "No session");
        
        setUser(initialSession?.user ?? null);
        setSession(initialSession);
        
        if (initialSession?.user) {
          console.log("Initial session: Fetching profile for user", initialSession.user.id);
          await loadUserProfile(initialSession.user.id);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error getting initial session:", error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initSession();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Handle different authentication events
   */
  const handleAuthEvent = (event: AuthEvent, session: Session | null) => {
    switch(event) {
      case 'SIGNED_IN':
        console.log("User signed in, updating state");
        break;
      case 'SIGNED_OUT':
        console.log("User signed out, clearing state");
        break;
      case 'USER_UPDATED':
        console.log("User details updated");
        break;
      case 'PASSWORD_RECOVERY':
        console.log("Password recovery initiated");
        break;
      case 'TOKEN_REFRESHED':
        console.log("Auth token refreshed");
        break;
      case 'EMAIL_CONFIRMED':
        console.log("Email confirmed successfully");
        break;
      case 'MFA_CHALLENGE_VERIFIED':
        console.log("MFA challenge verified");
        break;
      case 'INITIAL_SESSION':
        console.log("Initial session loaded");
        break;
    }
  };

  /**
   * Load user profile from Supabase
   */
  const loadUserProfile = async (userId: string) => {
    try {
      console.log("Loading profile data for user:", userId);
      const profileData = await fetchUserProfile(userId, supabase);
      
      if (profileData) {
        console.log("Profile data loaded successfully:", profileData);
        setProfile(profileData);
      } else {
        console.log("No profile data found for user:", userId);
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  };

  /**
   * Sign out the current user
   */
  const signOut = async () => {
    try {
      console.log("Signing out...");
      
      // Clean up auth state before signing out
      cleanupAuthState();
      
      // Sign out from Supabase
      await supabase.auth.signOut({ scope: 'global' });
      
      // Reset state
      setUser(null);
      setSession(null);
      setProfile(null);
      
      console.log("Sign out successful, navigating to /auth");
      // Navigate to auth page with full page refresh
      safeNavigate("/auth");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const contextValue: AuthContextProps = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    signOut,
    profile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
