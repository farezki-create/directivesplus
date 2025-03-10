
import { Button } from "./ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { ArrowLeft } from "lucide-react";
import { PurchaseDialog } from "./purchase/PurchaseDialog";
import { LanguageSelector } from "./LanguageSelector";
import { NavigationButtons } from "./header/NavigationButtons";
import { AuthButtons } from "./header/AuthButtons";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);

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

  const isHomePage = location.pathname === "/";
  const navButtonClass = "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 text-white";

  return (
    <>
      <header className="w-full border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col items-center mb-4">
            <h1 className="text-2xl font-bold text-primary">DirectivesPlus</h1>
          </div>
          
          <div className="flex items-center justify-center space-x-4 flex-wrap">
            {!isHomePage && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                aria-label="Retour"
              >
                <ArrowLeft className="h-5 w-5" />
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
              onClick={() => window.location.href = "/?writing=true"}
            >
              Je rédige
            </Button>
            
            {user && (
              <Button
                className={navButtonClass}
                onClick={() => navigate("/generate-pdf")}
              >
                Mes directives générées
              </Button>
            )}
            
            <NavigationButtons 
              navButtonClass={navButtonClass}
              onShowPurchase={() => setShowPurchaseDialog(true)}
            />
            
            <LanguageSelector />
            
            <AuthButtons user={user} />
          </div>
        </div>
      </header>

      <PurchaseDialog 
        open={showPurchaseDialog}
        onOpenChange={setShowPurchaseDialog}
        user={user}
      />
    </>
  );
};
