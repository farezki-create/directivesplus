
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";

interface BackButtonProps {
  to?: string;
  className?: string;
  onClick?: () => void;
}

export function BackButton({ to, className = "", onClick }: BackButtonProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    } else {
      window.history.back();
    }
  };
  
  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      className={`flex items-center gap-2 mb-4 ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      {t('back')}
    </Button>
  );
}
