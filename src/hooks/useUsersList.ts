
import { useState, useEffect } from 'react';
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

  const { data: profiles, isLoading, error } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) {
        throw new Error(error.message);
      }

      return profiles as SupabaseProfile[];
    },
  });

  useEffect(() => {
    if (profiles) {
      // Fetch auth users to get additional data like email
      const fetchAuthData = async () => {
        try {
          const { data: authData, error } = await supabase.auth.admin.listUsers();
          
          if (error) {
            throw error;
          }

          // Map the profiles with auth data
          const mappedUsers = profiles.map((profile) => {
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
              termsAccepted: false, // Default value if not found
            };
          });

          setUserProfiles(mappedUsers);
        } catch (error: any) {
          toast.error("Erreur lors du chargement des données utilisateur", {
            description: error.message,
          });
        }
      };

      fetchAuthData();
    }
  }, [profiles]);

  return { userProfiles, isLoading, error };
};
