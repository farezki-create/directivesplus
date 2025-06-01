
import { User } from "@supabase/supabase-js";
import { Profile, ProfileFormValues } from "./types";

export const createDefaultFormValues = (): ProfileFormValues => ({
  firstName: "",
  lastName: "",
  email: "",
  birthDate: undefined,
  phoneNumber: "",
  address: "",
  city: "",
  postalCode: "",
  country: "",
});

export const transformProfileToFormValues = (profile: Profile, userEmail: string): ProfileFormValues => {
  const birthDate = profile.birth_date ? new Date(profile.birth_date) : undefined;
  
  return {
    firstName: profile.first_name || "",
    lastName: profile.last_name || "",
    email: userEmail,
    birthDate: birthDate,
    phoneNumber: profile.phone_number || "",
    address: profile.address || "",
    city: profile.city || "",
    postalCode: profile.postal_code || "",
    country: profile.country || "",
  };
};

export const enrichProfileWithUserData = (profileData: any, user: User): Profile => {
  const userRole = user.user_metadata?.role || "patient";
  
  return {
    ...profileData,
    email: user.email || "",
    role: userRole as "patient" | "medecin" | "institution"
  };
};

export const createProfileFromMetadata = (userId: string, user: User) => {
  const metadata = user.user_metadata || {};
  
  return {
    id: userId,
    first_name: metadata.first_name || "",
    last_name: metadata.last_name || "",
    birth_date: metadata.birth_date || null,
    phone_number: metadata.phone_number || "",
    address: metadata.address || "",
    city: metadata.city || "",
    postal_code: metadata.postal_code || "",
    country: metadata.country || "",
  };
};
