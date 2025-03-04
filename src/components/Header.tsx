
import { Button } from "./ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { CreditCard, MessageSquare, FileEdit, Home } from "lucide-react";
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
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleHomeClick = () => {
    window.location.href = "/";
  };

  const isHomePage = location.pathname === "/";

  return (
    <>
      <header className="w-full border-b">
        <div className="container mx-auto px-4">
          {/* Top level - Logo and User Authentication */}
          <div className="py-3 flex justify-between items-center border-b">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary">DirectivesPlus</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              
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
          
          {/* Second level - Navigation */}
          <div className="py-2">
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
                variant="ghost"
                size="sm"
                onClick={() => navigate("/modify-directives")}
                className="flex items-center gap-2"
              >
                <FileEdit className="w-4 h-4" />
                {t('modifyDirectives')}
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
