
import { Button } from "./ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { ArrowLeft, FileText, File } from "lucide-react";
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
      navigate("/", { state: { writing: true } });
    } else {
      navigate("/auth");
    }
  };
  
  const navigateTo = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(path);
  };
  
  const isHomePage = location.pathname === "/";
  const navButtonClass = "text-sm px-3 py-1.5 rounded-md bg-white border border-blue-300 text-blue-700 hover:bg-blue-50 transition-all duration-200 shadow-sm";

  return (
    <header className="w-full border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col items-center mb-4">
          <div className="bg-white rounded-2xl p-2 shadow-sm">
            <img 
              src="/lovable-uploads/9dc463a0-3586-4bc4-800c-2c9c060adad4.png" 
              alt="DirectivesPlus Logo" 
              className="h-36 object-contain" 
            />
          </div>
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
            onClick={navigateTo("/")}
          >
            Accueil
          </Button>
          
          <Button
            className={navButtonClass}
            onClick={handleWritingClick}
          >
            Je rédige
          </Button>
          
          {user && (
            <>
              <Button
                className={navButtonClass}
                onClick={navigateTo("/generate-pdf")}
              >
                Mes directives
              </Button>
              
              <Button
                className={navButtonClass}
                onClick={navigateTo("/my-documents")}
              >
                <FileText className="h-4 w-4 mr-1" />
                Mes documents
              </Button>
              
              <Button
                className={navButtonClass}
                onClick={navigateTo("/medical-data")}
              >
                <File className="h-4 w-4 mr-1" />
                Mes données médicales
              </Button>
            </>
          )}
          
          <NavigationButtons navButtonClass={navButtonClass} />
          
          <LanguageSelector />
          
          <AuthButtons user={user} />
        </div>
      </div>
    </header>
  );
}
