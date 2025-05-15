
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ProfileSectionProps {
  profileData: any;
}

const ProfileSection = ({ profileData }: ProfileSectionProps) => {
  if (!profileData) return null;
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle>Informations personnelles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-medium">Nom et prénom:</p>
            <p>{profileData.last_name} {profileData.first_name}</p>
          </div>
          {profileData.birth_date && (
            <div>
              <p className="font-medium">Date de naissance:</p>
              <p>{new Date(profileData.birth_date).toLocaleDateString('fr-FR')}</p>
            </div>
          )}
          {(profileData.address || profileData.postal_code || profileData.city) && (
            <div className="col-span-1 md:col-span-2">
              <p className="font-medium">Adresse:</p>
              <p>
                {profileData.address && `${profileData.address}, `}
                {profileData.postal_code && `${profileData.postal_code} `}
                {profileData.city && profileData.city}
              </p>
            </div>
          )}
          {profileData.phone_number && (
            <div>
              <p className="font-medium">Téléphone:</p>
              <p>{profileData.phone_number}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSection;
