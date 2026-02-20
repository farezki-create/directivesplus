
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Profile, ProfileFormValues, UseProfileDataReturn } from "./types";
import { useProfileFetch } from "./useProfileFetch";
import { useProfileLogout } from "./useProfileLogout";

export function useProfileData(): UseProfileDataReturn {
  const navigate = useNavigate();
  const { user, profile: authProfile } = useAuth();
  
  const {
    profile,
    setProfile,
    formValues,
    isLoading,
    setIsLoading
  } = useProfileFetch({ user, authProfile });

  const { handleLogout } = useProfileLogout();

  // Check authentication and redirect if needed
  if (!user || !user.id) {
    toast.error("Session expirée", {
      description: "Veuillez vous reconnecter",
    });
    navigate("/auth");
  }

  // Handle profile update
  const handleProfileUpdate = useCallback((updatedProfile: Partial<Profile>) => {
    if (!profile) return;
    
    setProfile({
      ...profile,
      ...updatedProfile
    });
  }, [profile, setProfile]);

  return {
    profile,
    isLoading,
    setIsLoading,
    formValues,
    handleProfileUpdate,
    handleLogout
  };
}
