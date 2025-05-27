
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  birthDate: string;
  createdAt: string;
  address: string;
  city: string;
  country: string;
  phoneNumber: string;
  postalCode: string;
  emailVerified: boolean;
  termsAccepted: boolean;
}

export const useUsersList = () => {
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);

  const fetchUsers = useCallback(async () => {
    try {
      console.log("🔍 Fetching users from profiles table...");
      
      // Fetch from profiles table only - accessible data
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error("❌ Error fetching profiles:", profilesError);
        throw profilesError;
      }

      console.log("✅ Profiles fetched successfully:", profiles?.length || 0);

      // Map the profiles data to our UserProfile interface
      const mappedUsers: UserProfile[] = (profiles || []).map((profile) => ({
        id: profile.id,
        email: '', // We can't access auth.users table, so email will be empty
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        role: 'user', // Default role since we can't access auth metadata
        birthDate: profile.birth_date || '',
        createdAt: profile.created_at,
        address: profile.address || '',
        city: profile.city || '',
        country: profile.country || '',
        phoneNumber: profile.phone_number || '',
        postalCode: profile.postal_code || '',
        emailVerified: false, // Can't determine without auth access
        termsAccepted: false, // Can't determine without auth access
      }));

      console.log("✅ Users mapped successfully:", mappedUsers.length);
      setUserProfiles(mappedUsers);
      return mappedUsers;
    } catch (error: any) {
      console.error("❌ Error in fetchUsers:", error);
      toast.error("Erreur lors du chargement des données utilisateur", {
        description: error.message,
      });
      throw error;
    }
  }, []);

  const { isLoading, error } = useQuery({
    queryKey: ['profiles'],
    queryFn: fetchUsers,
  });

  return { users: userProfiles, isLoading, error, fetchUsers };
};
