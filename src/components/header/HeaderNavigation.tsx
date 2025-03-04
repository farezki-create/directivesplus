
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home, MessageSquare, CreditCard, BookOpen } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface HeaderNavigationProps {
  setShowPurchaseDialog: (show: boolean) => void;
}

export const HeaderNavigation = ({ setShowPurchaseDialog }: HeaderNavigationProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleHomeClick = () => {
    window.location.href = "/";
  };

  return (
    <nav className="flex items-center space-x-2 overflow-x-auto md:justify-center">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleHomeClick}
        className="flex items-center gap-2"
      >
        <Home className="w-4 h-4" />
        {t('home')}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate("/examples")}
        className="flex items-center gap-2"
      >
        <BookOpen className="w-4 h-4" />
        {t('examples')}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate("/reviews")}
        className="flex items-center gap-2"
      >
        <MessageSquare className="w-4 h-4" />
        {t('reviews')}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowPurchaseDialog(true)}
        className="flex items-center gap-2"
      >
        <CreditCard className="w-4 h-4" />
        {t('buyCard')}
      </Button>
    </nav>
  );
};
