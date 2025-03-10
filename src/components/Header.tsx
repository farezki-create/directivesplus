
import { Button } from "./ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { CreditCard, MessageSquare, ArrowLeft, FileText, PenLine } from "lucide-react";
import { PurchaseDialog } from "./purchase/PurchaseDialog";
import { LanguageSelector } from "./LanguageSelector";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "@/hooks/use-toast";

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
    if (user) {
      try {
        // Delete directives from Supabase
        const { error: directivesError } = await supabase
          .from("directives")
          .delete()
          .eq("user_id", user.id);
          
        if (directivesError) {
          console.error("Erreur lors de la suppression des directives:", directivesError);
        } else {
          console.log("Directives supprimées avec succès");
        }
        
        // Delete synthesis from Supabase
        const { error: synthesisError } = await supabase
          .from("questionnaire_synthesis")
          .delete()
          .eq("user_id", user.id);
          
        if (synthesisError) {
          console.error("Erreur lors de la suppression de la synthèse:", synthesisError);
        } else {
          console.log("Synthèse supprimée avec succès");
        }
        
        // Notify user of directive deletion
        toast({
          title: "Suppression des données",
          description: "Vos directives anticipées ont été supprimées avec succès.",
        });
      } catch (error) {
        console.error("Erreur lors du nettoyage des données:", error);
      }
    }
    
    // Delete locally stored PDFs
    const pdfUrls = Object.keys(localStorage).filter(key => 
      key.startsWith('pdf_') || key.includes('dataurlstring')
    );
    
    pdfUrls.forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Revoke object URLs
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
    
    // Log out user
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleHomeClick = () => {
    window.location.href = "/";
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleWriteClick = () => {
    // Force a page reload to ensure the writing section is properly displayed
    window.location.href = "/?writing=true";
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
          <div className="flex items-center space-x-2">
            <Button
              className={navButtonClass}
              onClick={() => navigate("/reviews")}
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              <span>{t('reviews')}</span>
            </Button>

            <Button
              className={navButtonClass}
              onClick={() => setShowPurchaseDialog(true)}
            >
              <CreditCard className="w-4 h-4 mr-1" />
              <span>{t('buyCard')}</span>
            </Button>
            
            <LanguageSelector />
            
            {user ? (
              <Button variant="default" onClick={handleSignOut} className={navButtonClass}>
                {t('logout')}
              </Button>
            ) : (
              <Button variant="default" onClick={() => navigate("/auth")} className={navButtonClass}>
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
      </header>

      <PurchaseDialog 
        open={showPurchaseDialog}
        onOpenChange={setShowPurchaseDialog}
        user={user}
      />
    </>
  );
};
