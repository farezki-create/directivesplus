import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileFormValues } from "./ProfileForm";
import { cleanupAuthState } from "@/utils/authUtils";
import { User } from "@supabase/supabase-js";

type Profile = {
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

export function useProfileData() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user, profile: authProfile } = useAuth();
  
  // Form default values
  const defaultFormValues: ProfileFormValues = {
    firstName: "",
    lastName: "",
    email: "",
    birthDate: undefined,
    phoneNumber: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  };

  // Form values state
  const [formValues, setFormValues] = useState<ProfileFormValues>(defaultFormValues);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user || !user.id) {
          console.log("No user found in context, redirecting to auth");
          toast.error("Session expirée", {
            description: "Veuillez vous reconnecter",
          });
          navigate("/auth");
          return;
        }

        console.log("Fetching profile for user ID:", user.id);
        console.log("Auth profile from context:", authProfile);

        // Try to use the profile from auth context first
        if (authProfile) {
          console.log("Using profile from auth context:", authProfile);
          const enrichedProfile = {
            ...authProfile,
            email: user.email || "",
            role: user.user_metadata?.role || "patient"
          };
          
          setProfile(enrichedProfile as Profile);
          
          // Transform the date string to a Date object if it exists
          const birthDate = authProfile.birth_date ? new Date(authProfile.birth_date) : undefined;
          
          const initialValues: ProfileFormValues = {
            firstName: authProfile.first_name || "",
            lastName: authProfile.last_name || "",
            email: user.email || "",
            birthDate: birthDate,
            phoneNumber: authProfile.phone_number || "",
            address: authProfile.address || "",
            city: authProfile.city || "",
            postalCode: authProfile.postal_code || "",
            country: authProfile.country || "",
          };
          
          setFormValues(initialValues);
          setIsLoading(false);
          console.log("Form values set from auth context:", initialValues);
          return;
        }

        // Get the user's profile from Supabase if not in auth context
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching profile:", error.message);
          toast.error("Erreur lors du chargement du profil", {
            description: error.message,
          });
          
          // If the profile doesn't exist, create it from user metadata
          if (error.code === 'PGRST116') {
            console.log("Profile not found, attempting to create from metadata");
            await createProfileFromMetadata(user.id, user);
          }
          
          return;
        }

        if (data) {
          console.log("Profile data loaded:", data);
          
          // Combine data with user email and role
          const userRole = user.user_metadata?.role || "patient";
          const enrichedProfile = {
            ...data,
            email: user.email || "",
            role: userRole as "patient" | "medecin" | "institution"
          };
          
          setProfile(enrichedProfile as Profile);
          
          // Transform the date string to a Date object if it exists
          const birthDate = data.birth_date ? new Date(data.birth_date) : undefined;
          
          const initialValues: ProfileFormValues = {
            firstName: data.first_name || "",
            lastName: data.last_name || "",
            email: user.email || "",
            birthDate: birthDate,
            phoneNumber: data.phone_number || "",
            address: data.address || "",
            city: data.city || "",
            postalCode: data.postal_code || "",
            country: data.country || "",
          };
          
          setFormValues(initialValues);
          console.log("Form values set:", initialValues);
        } else {
          console.log("No profile data found for user ID:", user.id);
          await createProfileFromMetadata(user.id, user);
        }
      } catch (error: any) {
        console.error("Error in fetchProfile:", error);
        toast.error("Une erreur est survenue", {
          description: error.message || "Veuillez réessayer plus tard",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, user, authProfile]);

  // Create a profile from user metadata if one doesn't exist
  const createProfileFromMetadata = async (userId: string, user: User) => {
    try {
      console.log("Creating profile from user metadata");
      const metadata = user.user_metadata || {};
      
      const profile = {
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
      
      console.log("New profile data:", profile);
      
      const { error } = await supabase
        .from("profiles")
        .insert(profile);
        
      if (error) {
        console.error("Error creating profile:", error);
        return;
      }
      
      // Set the profile and form values
      const enrichedProfile = {
        ...profile,
        email: user.email || "",
        role: "patient" as const
      };
      
      setProfile(enrichedProfile);
      
      // Transform the date string to a Date object if it exists
      const birthDate = profile.birth_date ? new Date(profile.birth_date) : undefined;
      
      const initialValues: ProfileFormValues = {
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        email: user.email || "",
        birthDate: birthDate,
        phoneNumber: profile.phone_number || "",
        address: profile.address || "",
        city: profile.city || "",
        postalCode: profile.postal_code || "",
        country: profile.country || "",
      };
      
      setFormValues(initialValues);
      console.log("Profile created from metadata, form values set:", initialValues);
      
      toast.success("Profil créé avec succès", {
        description: "Les informations de votre inscription ont été récupérées."
      });
    } catch (error: any) {
      console.error("Error creating profile from metadata:", error);
    }
  };

  // Handle profile update
  const handleProfileUpdate = (updatedProfile: Partial<Profile>) => {
    if (!profile) return;
    
    setProfile({
      ...profile,
      ...updatedProfile
    });
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      // Clean up auth state
      cleanupAuthState();
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Ignore errors
      }
      
      toast.success("Déconnexion réussie");
      
      // Force page reload for a clean state
      window.location.href = '/auth';
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  return {
    profile,
    isLoading,
    setIsLoading,
    formValues,
    handleProfileUpdate,
    handleLogout
  };
}
