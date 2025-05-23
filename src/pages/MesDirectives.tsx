
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { DirectivesAccessForm } from "@/components/mes-directives/DirectivesAccessForm"; 
import LoginLink from "@/components/mes-directives/LoginLink";
import Footer from "@/components/Footer";
import { useDossierStore } from "@/store/dossierStore";
import { useVerifierCodeAcces } from "@/hooks/useVerifierCodeAcces";
import { toast } from "@/hooks/use-toast";

export default function MesDirectives() {
  console.log("Rendering MesDirectives - PUBLIC PAGE");
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { setDossierActif } = useDossierStore();
  const { getDossierUtilisateurAuthentifie } = useVerifierCodeAcces();

  // Only try to load user directives if the user is authenticated
  useEffect(() => {
    const loadUserDirectives = async () => {
      if (!isAuthenticated || !user) return;
      
      try {
        console.log("MesDirectives - Loading directives for user:", user.id);
        // Try to get the user's dossier
        const dossier = await getDossierUtilisateurAuthentifie(user.id, "directive");
        
        if (dossier) {
          console.log("MesDirectives - Dossier loaded successfully:", dossier);
          setDossierActif(dossier);
          toast({
            title: "Accès autorisé",
            description: "Vos directives ont été chargées avec succès"
          });
          navigate("/dashboard");
        } else {
          // Navigate to dashboard anyway, where they can create/upload directives
          console.log("MesDirectives - User authenticated but no dossier found");
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("MesDirectives - Error loading directives:", error);
        // Still redirect to dashboard even if there's an error
        navigate("/dashboard");
      }
    };

    loadUserDirectives();
  }, [isAuthenticated, user, navigate, setDossierActif, getDossierUtilisateurAuthentifie]);

  // The main page render should always work regardless of authentication status
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-md mx-auto">
          <DirectivesAccessForm />
          <LoginLink />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
