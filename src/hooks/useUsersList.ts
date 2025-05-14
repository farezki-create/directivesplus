
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export interface SupabaseProfile {
  id: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  address: string;
  city: string;
  country: string;
  created_at: string;
  phone_number: string;
  postal_code: string;
  medical_access_code: string;
}

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
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        throw authError;
      }

      const { data, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) {
        throw profilesError;
      }

      // Explicitly type the profiles data to avoid the 'never' type issue
      const profiles = data as SupabaseProfile[];

      // Map the profiles with auth data
      // Explicitly type the profile parameter to SupabaseProfile
      const mappedUsers = profiles.map((profile: SupabaseProfile) => {
        // Find the matching auth user
        const authUser = authData.users.find(user => user.id === profile.id);
        
        return {
          id: profile.id,
          email: authUser?.email || '',
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          role: authUser?.user_metadata?.role || '',
          birthDate: profile.birth_date || '',
          createdAt: profile.created_at,
          address: profile.address || '',
          city: profile.city || '',
          country: profile.country || '',
          phoneNumber: profile.phone_number || '',
          postalCode: profile.postal_code || '',
          emailVerified: authUser?.email_confirmed_at ? true : false,
          termsAccepted: authUser?.user_metadata?.terms_accepted || false,
        };
      });

      setUserProfiles(mappedUsers);
      return mappedUsers;
    } catch (error: any) {
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
