
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, PenLine } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { User } from "@supabase/supabase-js";

interface SecondaryNavigationProps {
  user: User | null;
  navButtonClass: string;
}

export const SecondaryNavigation = ({ user, navButtonClass }: SecondaryNavigationProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleHomeClick = () => {
    window.location.href = "/";
  };

  const handleWriteClick = () => {
    window.location.href = "/?writing=true";
  };

  return (
    <div className="w-full bg-gray-50 py-2 shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-center gap-4 flex-wrap">
        <Button
          className={navButtonClass}
          onClick={handleHomeClick}
        >
          {t('home')}
        </Button>

        <Button
          className={navButtonClass}
          onClick={handleWriteClick}
        >
          <PenLine className="w-4 h-4 mr-1" />
          <span>Je rédige</span>
        </Button>

        {user && (
          <Button
            className={navButtonClass}
            onClick={() => navigate("/generate-pdf")}
          >
            <FileText className="w-4 h-4 mr-1" />
            <span>Mes directives générées</span>
          </Button>
        )}
      </div>
    </div>
  );
};
