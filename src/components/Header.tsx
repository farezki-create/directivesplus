import { Button } from "./ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { ArrowLeft } from "lucide-react";
import { LanguageSelector } from "./LanguageSelector";
import { NavigationButtons } from "./header/NavigationButtons";
import { AuthButtons } from "./header/AuthButtons";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleWritingClick = () => {
    if (user) {
      window.location.href = "/?writing=true";
    } else {
      navigate("/auth");
    }
  };

  const isHomePage = location.pathname === "/";
  const navButtonClass = "text-sm px-3 py-1.5 rounded-md bg-white border border-purple-300 text-purple-700 hover:bg-purple-50 transition-all duration-200 shadow-sm";

  return (
    <header className="w-full border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col items-center mb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">DirectivesPlus</h1>
        </div>
        
        <div className="flex items-center justify-center space-x-3 flex-wrap">
          {!isHomePage && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              aria-label="Retour"
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            className={navButtonClass}
            onClick={() => window.location.href = "/"}
          >
            Accueil
          </Button>
          
          <Button
            className={navButtonClass}
            onClick={handleWritingClick}
          >
            Je rédige
          </Button>
          
          {user ? (
            <>
              <Button
                className={navButtonClass}
                onClick={() => navigate("/generate-pdf")}
              >
                Mes directives
              </Button>
              
              <Button
                className={navButtonClass}
                onClick={() => navigate("/my-documents")}
              >
                Mes documents
              </Button>
            </>
          ) : (
            <Button
              className={navButtonClass}
              onClick={() => navigate("/my-documents")}
            >
              Documents partagés
            </Button>
          )}
          
          <NavigationButtons navButtonClass={navButtonClass} />
          
          <LanguageSelector />
          
          <AuthButtons user={user} />
        </div>
      </div>
    </header>
  );
};
