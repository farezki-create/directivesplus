
import React, { createContext, useState, useEffect, useContext, useRef } from "react";
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
  
  // Use refs to track auth state and prevent duplicate operations
  const authInitialized = useRef(false);
  const redirectInProgress = useRef(false);
  const profileFetchInProgress = useRef(false);

  useEffect(() => {
    console.log("Setting up auth state listener");
    let isMounted = true;
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthEvent, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.id);
        
        if (!isMounted) {
          console.log("Component unmounted, ignoring auth state change");
          return;
        }
        
        // Process the auth event
        handleAuthEvent(event, currentSession);
        
        // Update state with new auth information
        setUser(currentSession?.user ?? null);
        setSession(currentSession);
        
        // Only mark as not loading after we have checked at least once
        if (!authInitialized.current) {
          setIsLoading(false);
          authInitialized.current = true;
        }

        // Only fetch profile if we have a user and not already fetching
        if (currentSession?.user && !profileFetchInProgress.current) {
          loadUserProfile(currentSession.user.id);
        } else if (!currentSession?.user) {
          setProfile(null);
        }
      }
    );

    // Then get initial session if not already initialized
    if (!authInitialized.current) {
      const initSession = async () => {
        try {
          console.log("Getting initial session");
          const { data: { session: initialSession } } = await supabase.auth.getSession();
          
          if (!isMounted) {
            console.log("Component unmounted, ignoring initial session");
            return;
          }
          
          console.log("Initial session check:", initialSession?.user?.id || "No session");
          
          setUser(initialSession?.user ?? null);
          setSession(initialSession);
          setIsLoading(false);
          authInitialized.current = true;

          if (initialSession?.user && !profileFetchInProgress.current) {
            loadUserProfile(initialSession.user.id);
          }
        } catch (error) {
          console.error("Error getting initial session:", error);
          if (isMounted) {
            setIsLoading(false);
            authInitialized.current = true;
          }
        }
      };

      initSession();
    }

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
        redirectInProgress.current = false;
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
    if (profileFetchInProgress.current) {
      console.log("Profile fetch already in progress, skipping");
      return;
    }
    
    profileFetchInProgress.current = true;
    try {
      const profileData = await fetchUserProfile(userId, supabase);
      if (profileData) {
        setProfile(profileData);
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    } finally {
      profileFetchInProgress.current = false;
    }
  };

  /**
   * Sign out the current user
   */
  const signOut = async () => {
    if (redirectInProgress.current) {
      console.log("Redirect already in progress, ignoring sign out");
      return;
    }
    
    redirectInProgress.current = true;
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
      redirectInProgress.current = false;
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
