
import { Card, CardContent } from "@/components/ui/card";
import { UserProfile } from "@/contexts/AuthContextTypes";

interface ProfileWarningProps {
  profile: UserProfile | null;
  firstName: string;
  lastName: string;
}

const ProfileWarning = ({ profile, firstName, lastName }: ProfileWarningProps) => {
  const showWarning = !profile || !firstName || !lastName;

  if (!showWarning) {
    return null;
  }

  return (
    <Card className="mb-6 border-yellow-200 bg-yellow-50">
      <CardContent className="pt-6">
        <h3 className="font-medium text-yellow-800 mb-2">Information manquante</h3>
        <p className="text-yellow-700 text-sm">
          {!profile ? (
            "Votre profil est incomplet. Veuillez compléter vos informations personnelles avant de générer votre carte d'accès."
          ) : !firstName || !lastName ? (
            "Votre nom et prénom sont nécessaires pour générer votre carte d'accès."
          ) : (
            "Des informations sont manquantes pour générer votre carte d'accès."
          )}
        </p>
      </CardContent>
    </Card>
  );
};

export default ProfileWarning;
