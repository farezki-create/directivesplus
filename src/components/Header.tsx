import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export const Header = () => {
  const navigate = useNavigate();
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleHomeClick = () => {
    // Force reload the page when going to home to reset all states
    window.location.href = "/";
  };

  return (
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
            variant="ghost"
            onClick={() => navigate("/healthcare")}
          >
            Professionnel de santé
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
          >
            En savoir plus
          </Button>
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