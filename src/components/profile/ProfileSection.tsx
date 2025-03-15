
import { UserProfile } from "@/components/pdf/types";

interface ProfileSectionProps {
  profile: UserProfile | null;
  loading: boolean;
}

export function ProfileSection({ profile, loading }: ProfileSectionProps) {
  if (loading || !profile) return null;
  
  return (
    <div className="mb-8 p-4 bg-gray-50 rounded-lg border">
      <h3 className="text-lg font-medium mb-3">Informations personnelles</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <span className="font-semibold">Nom :</span> {profile.last_name || 'Non renseigné'}
        </div>
        <div>
          <span className="font-semibold">Prénom :</span> {profile.first_name || 'Non renseigné'}
        </div>
        <div>
          <span className="font-semibold">Date de naissance :</span> {profile.birth_date || 'Non renseignée'}
        </div>
        <div>
          <span className="font-semibold">Adresse :</span> {profile.address ? `${profile.address}, ${profile.postal_code} ${profile.city}` : 'Non renseignée'}
        </div>
      </div>
    </div>
  );
}
