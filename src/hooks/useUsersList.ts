
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import type { UserProfile } from "@/components/admin/UsersTable";

// Define a type for what Supabase actually returns from the profiles table
type SupabaseProfile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string | null;
  address: string | null;
  birth_date: string | null;
  city: string | null;
  country: string | null;
  medical_access_code: string | null;
  phone_number: string | null;
  postal_code: string | null;
}

export function useUsersList() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) {
        toast.error("Erreur lors du chargement des utilisateurs", {
          description: profilesError.message,
        });
        setError(profilesError.message);
        return;
      }

      // Get auth users to get emails and supplement data
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error("Error fetching auth users:", authError);
      }

      // Map profiles with auth data
      const typedProfilesData = profilesData as SupabaseProfile[];
      const enrichedUsers: UserProfile[] = typedProfilesData.map(profile => {
        // Find matching auth user
        const authUser = authData?.users?.find(user => user.id === profile.id);
        
        return {
          id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          created_at: profile.created_at,
          email: authUser?.email || "Email inconnu",
          // Since role might not be in the profile, provide a default
          role: (authUser?.user_metadata?.role as "patient" | "medecin" | "institution") || "patient",
          email_verified: !!authUser?.email_confirmed_at,
          terms_accepted: false // Default value as terms_accepted might not exist yet in profiles
        };
      });

      setUsers(enrichedUsers);
    } catch (error: any) {
      setError(error.message || "Une erreur est survenue");
      toast.error("Une erreur est survenue", {
        description: error.message || "Veuillez réessayer plus tard",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    users,
    isLoading,
    error,
    fetchUsers
  };
}
