
import { useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Profile, ProfileFormValues } from "./types";
import { 
  createProfileFromMetadata as createProfileData, 
  enrichProfileWithUserData, 
  transformProfileToFormValues 
} from "./profileUtils";

export const useProfileCreation = () => {
  const createProfileFromMetadata = useCallback(async (
    userId: string, 
    user: User, 
    setProfile: (profile: Profile) => void,
    setFormValues: (values: ProfileFormValues) => void
  ) => {
    try {
      console.log("Creating profile from user metadata");
      const profileData = createProfileData(userId, user);
      
      console.log("New profile data:", profileData);
      
      const { error } = await supabase
        .from("profiles")
        .insert(profileData);
        
      if (error) {
        console.error("Error creating profile:", error);
        return;
      }
      
      // Set the profile and form values
      const enrichedProfile = enrichProfileWithUserData(profileData, user);
      setProfile(enrichedProfile);
      
      const initialValues = transformProfileToFormValues(enrichedProfile, user.email || "");
      setFormValues(initialValues);
      console.log("Profile created from metadata, form values set:", initialValues);
      
      toast.success("Profil créé avec succès", {
        description: "Les informations de votre inscription ont été récupérées."
      });
    } catch (error: any) {
      console.error("Error creating profile from metadata:", error);
    }
  }, []);

  return {
    createProfileFromMetadata
  };
};
