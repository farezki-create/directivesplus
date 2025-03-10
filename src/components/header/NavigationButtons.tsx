
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { MessageSquare, CreditCard } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface NavigationButtonsProps {
  navButtonClass: string;
  onShowPurchase: () => void;
}

export const NavigationButtons = ({ navButtonClass, onShowPurchase }: NavigationButtonsProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <>
      <Button
        variant="outline"
        onClick={() => navigate("/reviews")}
      >
        <MessageSquare className="w-4 h-4 mr-1" />
        <span>{t('reviews')}</span>
      </Button>

      <Button
        variant="outline"
        onClick={onShowPurchase}
      >
        <CreditCard className="w-4 h-4 mr-1" />
        <span>{t('buyCard')}</span>
      </Button>
    </>
  );
};
