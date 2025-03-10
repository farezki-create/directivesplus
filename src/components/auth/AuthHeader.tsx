
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";

type AuthHeaderProps = {
  isSignUp: boolean;
};

export const AuthHeader = ({ isSignUp }: AuthHeaderProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  if (!isSignUp) return null;
  
  return (
    <Button
      variant="ghost"
      className="absolute top-4 left-4 gap-2 hover:bg-purple-50 hover:text-purple-700 transition-colors"
      onClick={() => navigate("/")}
    >
      <ArrowLeft className="h-4 w-4" />
      {t('backToHome')}
    </Button>
  );
};
