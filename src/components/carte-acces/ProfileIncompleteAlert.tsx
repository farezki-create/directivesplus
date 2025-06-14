
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProfileIncompleteAlertProps {
  isProfileIncomplete: boolean;
}

const ProfileIncompleteAlert = ({ isProfileIncomplete }: ProfileIncompleteAlertProps) => {
  const navigate = useNavigate();

  if (!isProfileIncomplete) return null;

  return (
    <Alert className="mb-6 bg-blue-50 border-blue-200">
      <User className="h-4 w-4" />
      <AlertDescription>
        <strong>Complétez votre profil</strong> pour personnaliser votre carte d'accès.{" "}
        <Button 
          variant="link" 
          className="p-0 h-auto font-normal underline text-blue-600"
          onClick={() => navigate("/profile")}
        >
          Aller au profil
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default ProfileIncompleteAlert;
