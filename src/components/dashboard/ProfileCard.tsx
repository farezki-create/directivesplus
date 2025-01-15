import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const ProfileCard = () => {
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      console.log('Fetching user profile...');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No user found');
        throw new Error('User not found');
      }
      console.log('User found:', user.id);

      // Récupérer le profil existant
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching profile:', fetchError);
        throw fetchError;
      }

      // Si le profil existe mais que les champs sont vides, on les met à jour avec les métadonnées
      if (existingProfile && !existingProfile.first_name && user.user_metadata) {
        console.log('Updating profile with user metadata...');
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            first_name: user.user_metadata.first_name,
            last_name: user.user_metadata.last_name,
            birth_date: user.user_metadata.birth_date,
            address: user.user_metadata.address,
            city: user.user_metadata.city,
            postal_code: user.user_metadata.postal_code,
            country: user.user_metadata.country,
            phone_number: user.user_metadata.phone_number,
          })
          .eq('id', user.id);

        if (updateError) {
          console.error('Error updating profile:', updateError);
          throw updateError;
        }

        // Récupérer le profil mis à jour
        const { data: updatedProfile, error: refetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (refetchError) {
          console.error('Error fetching updated profile:', refetchError);
          throw refetchError;
        }

        console.log('Profile updated:', updatedProfile);
        return updatedProfile;
      }

      console.log('Profile data:', existingProfile);
      return existingProfile;
    },
  });

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Informations personnelles</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoadingProfile ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[180px]" />
          </div>
        ) : profile ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nom complet</p>
              <p className="font-medium">
                {profile.first_name || '-'} {profile.last_name || '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date de naissance</p>
              <p className="font-medium">
                {profile.birth_date ? new Date(profile.birth_date).toLocaleDateString('fr-FR') : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Adresse</p>
              <p className="font-medium">
                {profile.address || '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ville</p>
              <p className="font-medium">
                {profile.city || '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Code postal</p>
              <p className="font-medium">
                {profile.postal_code || '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pays</p>
              <p className="font-medium">
                {profile.country || '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Téléphone</p>
              <p className="font-medium">
                {profile.phone_number || '-'}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">Aucune information disponible</p>
        )}
      </CardContent>
    </Card>
  );
};