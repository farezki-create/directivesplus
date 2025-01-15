import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Récupérer la session initiale
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Session initiale récupérée:", session);
      setUser(session?.user ?? null);
    });

    // Écouter les changements de session
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Changement d'état d'authentification:", _event, session?.user);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    console.log("Déconnexion demandée");
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <header className="w-full border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 
            className="text-2xl font-bold text-primary cursor-pointer" 
            onClick={() => navigate("/")}
          >
            DirectivesPlus
          </h1>
        </div>
        <nav className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
          >
            Accueil
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
          >
            En savoir plus
          </Button>
          {user && (
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
            >
              Tableau de bord
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
  );
};