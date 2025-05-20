
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Profile } from "@/contexts/AuthContextTypes";

interface ProfileWarningProps {
  profile: Profile | null;
  firstName: string;
  lastName: string;
}

const ProfileWarning = ({ profile, firstName, lastName }: ProfileWarningProps) => {
  const navigate = useNavigate();
  
  // Only show warning if profile is missing or incomplete
  if (profile && (firstName || lastName)) {
    return null;
  }
  
  return (
    <Card className="mb-6 border-yellow-200 bg-yellow-50">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <User className="h-6 w-6 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-800">Profil incomplet</h3>
            <p className="text-sm text-yellow-700">
              Pour une meilleure expérience avec votre carte d'accès, veuillez compléter 
              votre profil avec vos informations personnelles.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3 border-yellow-300 bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
              onClick={() => navigate("/profile")}
            >
              Compléter mon profil
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileWarning;
