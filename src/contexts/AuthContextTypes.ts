
import { Session, User } from "@supabase/supabase-js";
import { ReactNode } from "react";

// Define the specific auth event type that includes all possible values
export type AuthEvent = 
  | 'INITIAL_SESSION'
  | 'SIGNED_IN'
  | 'SIGNED_OUT'
  | 'USER_UPDATED'
  | 'PASSWORD_RECOVERY'
  | 'TOKEN_REFRESHED'
  | 'EMAIL_CONFIRMED'
  | 'MFA_CHALLENGE_VERIFIED';

export interface AuthContextProps {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  profile: any | null;
}

export interface AuthProviderProps {
  children: ReactNode;
}
