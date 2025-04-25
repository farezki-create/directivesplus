
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface NavigationButtonsProps {
  navButtonClass: string;
}

export const NavigationButtons = ({ navButtonClass }: NavigationButtonsProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <Button
      className={navButtonClass}
      onClick={() => navigate("/reviews")}
    >
      <MessageSquare className="w-3 h-3 mr-1" />
      <span>{t('reviews')}</span>
    </Button>
  );
};
