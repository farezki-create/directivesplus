
import { Button } from "../ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { FileText, PenLine } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { User } from "@supabase/supabase-js";

interface SecondaryNavigationProps {
  user: User | null;
  navButtonClass: string;
}

export const SecondaryNavigation = ({ user, navButtonClass }: SecondaryNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const handleHomeClick = () => {
    window.location.href = "/";
  };

  const handleWriteClick = () => {
    if (user) {
      window.location.href = "/?writing=true";
    } else {
      navigate("/auth?writing=true");
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-purple-50 to-purple-100 py-3 shadow-sm border-b border-purple-200">
      <div className="container mx-auto px-4 flex items-center justify-center gap-4 flex-wrap">
        <Button
          className={`${navButtonClass} transition-all duration-300 hover:scale-105 hover:shadow-md bg-white border-purple-300 text-purple-700 hover:bg-purple-50`}
          onClick={handleHomeClick}
        >
          {t('home')}
        </Button>

        <Button
          className={`${navButtonClass} transition-all duration-300 hover:scale-105 hover:shadow-md bg-white border-purple-300 text-purple-700 hover:bg-purple-50 flex items-center gap-2`}
          onClick={handleWriteClick}
        >
          <PenLine className="w-4 h-4 mr-1" />
          <span>Je rédige</span>
        </Button>
      </div>
    </div>
  );
};
