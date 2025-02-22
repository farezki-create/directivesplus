
import { Button } from "./ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { DocumentScanner } from "@/components/DocumentScanner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { CreditCard } from "lucide-react";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [isCardFormat, setIsCardFormat] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
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
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary">DirectivesPlus</h1>
          </div>
          <nav className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={handleHomeClick}
            >
              Accueil
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowPurchaseDialog(true)}
              className="flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Achat carte
            </Button>

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
          </nav>
        </div>
      </header>

      <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Carte mémoire USB format carte de crédit</DialogTitle>
            <DialogDescription>
              Stockez vos directives anticipées sur une carte mémoire USB au format carte de crédit.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="aspect-video bg-white relative rounded-lg overflow-hidden">
              <img 
                src="/lovable-uploads/6bb21b02-63a3-4da2-8feb-a4ec9237c2bf.png"
                alt="Carte mémoire USB Directives Anticipées"
                className="object-contain w-full h-full"
              />
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Caractéristiques</h4>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Format carte de crédit - Se range facilement dans votre portefeuille</li>
                <li>Connecteur USB intégré</li>
                <li>Stockage sécurisé de vos directives anticipées</li>
                <li>Compatibilité universelle</li>
              </ul>
            </div>

            <div>
              <p className="text-2xl font-bold text-center">
                Prix à définir
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowPurchaseDialog(false)}>
              Annuler
            </Button>
            <Button type="button" disabled>
              Commander
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
