export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  phone_number: string | null;
  unique_identifier: string;
  email?: string;
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