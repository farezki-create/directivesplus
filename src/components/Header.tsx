
import { Button } from "./ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileText, User as UserIcon, CreditCard, Files, Menu } from "lucide-react";
import { PDFGenerator } from "@/components/PDFGenerator";
import { DocumentScanner } from "@/components/DocumentScanner";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [isCardFormat, setIsCardFormat] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleHomeClick = () => {
    window.location.href = "/";
  };

  const handlePDFGeneration = (isCard: boolean) => {
    setIsCardFormat(isCard);
    setShowPDFPreview(true);
  };

  const isHomePage = location.pathname === "/";

  const navItems = (
    <>
      <Button
        variant="ghost"
        onClick={handleHomeClick}
      >
        Accueil
      </Button>

      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <Files className="mr-2 h-4 w-4" />
              Documents
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => navigate("/dashboard?tab=persons")}>
              <UserIcon className="mr-2 h-4 w-4" />
              Ma personne de confiance
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handlePDFGeneration(false)}>
              <FileText className="mr-2 h-4 w-4" />
              Mes Directives anticipées
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handlePDFGeneration(true)}>
              <CreditCard className="mr-2 h-4 w-4" />
              Mes Directives anticipées en format carte
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowScanner(true)}>
              <Files className="mr-2 h-4 w-4" />
              Documents de santé utiles
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <Button
        variant="ghost"
        onClick={() => navigate("/dashboard")}
      >
        En savoir plus
      </Button>
      
      {user && !isHomePage && (
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
        >
          Désignation de la personne de confiance
        </Button>
      )}
      
      {user ? (
        <Button variant="default" onClick={handleSignOut}>
          Déconnexion
        </Button>
      ) : (
        <Button variant="default" onClick={() => navigate("/auth")}>
          Connexion
        </Button>
      )}
    </>
  );

  return (
    <header className="w-full border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-primary">DirectivesPlus</h1>
        </div>
        
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col space-y-4 mt-4">
                {navItems}
              </nav>
            </SheetContent>
          </Sheet>
        ) : (
          <nav className="flex items-center space-x-4">
            {navItems}
          </nav>
        )}

        {showPDFPreview && user && (
          <PDFGenerator 
            userId={user.id}
            isCardFormat={isCardFormat}
          />
        )}

        <DocumentScanner 
          open={showScanner} 
          onClose={() => setShowScanner(false)} 
        />
      </div>
    </header>
  );
};
