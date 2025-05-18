
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CardDescription, CardTitle } from "@/components/ui/card";

interface ProfileHeaderProps {
  firstName?: string | null;
  lastName?: string | null;
  role?: "patient" | "medecin" | "institution";
}

export default function ProfileHeader({ firstName, lastName, role }: ProfileHeaderProps) {
  const roleLabel = {
    patient: "Patient / Personne physique",
    medecin: "Médecin / Professionnel de santé",
    institution: "Institution / Établissement de santé",
  };
  
  return (
    <div className="flex flex-col items-center space-y-2">
      <Avatar className="h-20 w-20">
        <AvatarFallback>
          {firstName?.[0]}{lastName?.[0]}
        </AvatarFallback>
      </Avatar>
      <div className="text-center">
        <p className="text-directiveplus-600 font-medium">{role ? roleLabel[role] : roleLabel.patient}</p>
      </div>
    </div>
  );
}
