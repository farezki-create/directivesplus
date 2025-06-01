
import { User } from "@supabase/supabase-js";

export type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  birth_date: string | null;
  phone_number: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  role: "patient" | "medecin" | "institution";
};

export type ProfileFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: Date | undefined;
  phoneNumber: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

export interface UseProfileDataReturn {
  profile: Profile | null;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  formValues: ProfileFormValues;
  handleProfileUpdate: (updatedProfile: Partial<Profile>) => void;
  handleLogout: () => Promise<void>;
}
