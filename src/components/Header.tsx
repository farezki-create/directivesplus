
import { Button } from "./ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { CreditCard, MessageSquare, ArrowLeft } from "lucide-react";
import { PurchaseDialog } from "./purchase/PurchaseDialog";
import { LanguageSelector } from "./LanguageSelector";
import { useLanguage } from "@/hooks/useLanguage";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const { t } = useLanguage();

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
    // Supprimer les PDFs stockés localement
    const pdfUrls = Object.keys(localStorage).filter(key => 
      key.startsWith('pdf_') || key.includes('dataurlstring')
    );
    
    pdfUrls.forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Nettoyage des URLs de données en mémoire
    if (window.URL && window.URL.revokeObjectURL) {
      pdfUrls.forEach(key => {
        try {
          const value = localStorage.getItem(key);
          if (value && value.startsWith('blob:')) {
            window.URL.revokeObjectURL(value);
          }
        } catch (e) {
          console.error('Erreur lors de la révocation de l\'URL:', e);
        }
      });
    }
    
    console.log('Documents PDFs supprimés lors de la déconnexion');
    
    // Déconnexion de l'utilisateur
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleHomeClick = () => {
    window.location.href = "/";
  };

  const handleBack = () => {
    navigate(-1);
  };

  const isHomePage = location.pathname === "/";

  const navButtonClass = "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 text-white";

  return (
    <>
      <header className="w-full border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {!isHomePage && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="mr-2"
                aria-label="Retour"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <h1 className="text-2xl font-bold text-primary">DirectivesPlus</h1>
          </div>
          <div>
            {user ? (
              <Button variant="default" onClick={handleSignOut}>
                {t('logout')}
              </Button>
            ) : (
              <Button variant="default" onClick={() => navigate("/auth")}>
                {t('login')}
              </Button>
            )}
          </div>
        </div>
        
        {/* Secondary navigation band */}
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
              onClick={() => navigate("/reviews")}
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t('reviews')}</span>
            </Button>

            <Button
              className={navButtonClass}
              onClick={() => setShowPurchaseDialog(true)}
            >
              <CreditCard className="w-4 h-4" />
              <span>{t('buyCard')}</span>
            </Button>
            
            <LanguageSelector />
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
