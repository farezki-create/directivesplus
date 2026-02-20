
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Profile, ProfileFormValues } from "./types";
import { 
  createDefaultFormValues, 
  transformProfileToFormValues, 
  enrichProfileWithUserData 
} from "./profileUtils";
import { useProfileCreation } from "./useProfileCreation";

interface UseProfileFetchProps {
  user: User | null;
  authProfile: any;
}

export const useProfileFetch = ({ user, authProfile }: UseProfileFetchProps) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formValues, setFormValues] = useState<ProfileFormValues>(createDefaultFormValues());
  const [isLoading, setIsLoading] = useState(true);
  
  const { createProfileFromMetadata } = useProfileCreation();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user || !user.id) return;

        if (authProfile) {
          const enrichedProfile = enrichProfileWithUserData(authProfile, user);
          setProfile(enrichedProfile as Profile);
          const initialValues = transformProfileToFormValues(enrichedProfile as Profile, user.email || "");
          setFormValues(initialValues);
          setIsLoading(false);
          return;
        }

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
          
          if (error.code === 'PGRST116') {
            await createProfileFromMetadata(user.id, user, setProfile, setFormValues);
          }
          
          return;
        }

        if (data) {
          const enrichedProfile = enrichProfileWithUserData(data, user);
          setProfile(enrichedProfile as Profile);
          const initialValues = transformProfileToFormValues(enrichedProfile as Profile, user.email || "");
          setFormValues(initialValues);
        } else {
          await createProfileFromMetadata(user.id, user, setProfile, setFormValues);
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
  }, [user, authProfile, createProfileFromMetadata]);

  return {
    profile,
    setProfile,
    formValues,
    setFormValues,
    isLoading,
    setIsLoading
  };
};
