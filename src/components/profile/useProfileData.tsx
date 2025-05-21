
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileFormValues } from "./ProfileForm";
import { cleanupAuthState } from "@/utils/authUtils";

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
  const { user } = useAuth();
  
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
        // Get the current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
          toast.error("Session expirée", {
            description: "Veuillez vous reconnecter",
          });
          navigate("/auth");
          return;
        }

        console.log("Métadonnées utilisateur:", user.user_metadata);

        // Get the user's profile
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          toast.error("Erreur lors du chargement du profil", {
            description: error.message,
          });
          return;
        }

        if (data) {
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
          console.log("Données du profil chargées:", initialValues);
        }
      } catch (error: any) {
        toast.error("Une erreur est survenue", {
          description: error.message || "Veuillez réessayer plus tard",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

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
