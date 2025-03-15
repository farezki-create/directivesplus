
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";

interface LoginButtonProps {
  buttonClass: string;
}

export const LoginButton = ({ buttonClass }: LoginButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const handleSignIn = () => {
    // Navigate to auth page with current location as the return URL
    navigate("/auth", { state: { from: location.pathname + location.search } });
  };

  return (
    <Button variant="default" onClick={handleSignIn} className={buttonClass}>
      {t('login')}
    </Button>
  );
};
