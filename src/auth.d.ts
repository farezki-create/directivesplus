
export interface AccessToken {
  token_type: string;
  access_token: string;
  expires_in: number;
  refresh_token: string;
  expires_at: number;
}

export interface User {
  id: string;
  email: string;
  confirmed_at?: string;
  last_sign_in_at?: string;
  created_at: string;
  updated_at: string;
  app_metadata: {
    provider?: string;
  };
  user_metadata: Record<string, any>;
}

export interface Session {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  user: User;
  expires_at: number;
}

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  birth_date?: string;
  roles?: string[];
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}
