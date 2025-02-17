
export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  birth_date: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  phone_number: string | null;
  email?: string;
  created_at?: string | null;
  unique_identifier?: string;
}

export interface TrustedPerson {
  id: string;
  name: string;
  phone: string;
  email: string;
  relation: string;
  address: string;
  city: string;
  postal_code: string;
}
