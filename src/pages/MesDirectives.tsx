
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import { DirectivesAccessForm } from "@/components/mes-directives/DirectivesAccessForm"; 
import LoginLink from "@/components/mes-directives/LoginLink";
import Footer from "@/components/Footer";
import { useDossierStore } from "@/store/dossierStore";
import { useVerifierCodeAcces } from "@/hooks/access/useVerifierCodeAcces";
import { toast } from "@/hooks/use-toast";

export default function MesDirectives() {
  console.log("Rendering MesDirectives - PUBLIC PAGE");
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { setDossierActif, dossierActif } = useDossierStore();
  const { getDossierUtilisateurAuthentifie } = useVerifierCodeAcces();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const codeParam = searchParams.get("code");
  
  // Only try to load user directives if the user is authenticated
  useEffect(() => {
    const loadUserDirectives = async () => {
      if (!isAuthenticated || !user || loading) return;
      
      try {
        setLoading(true);
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
          toast({
            title: "Information",
            description: "Aucune directive trouvée. Vous pouvez en créer ou en télécharger."
          });
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("MesDirectives - Error loading directives:", error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors du chargement de vos directives",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserDirectives();
  }, [isAuthenticated, user, navigate, setDossierActif, getDossierUtilisateurAuthentifie, loading]);

  // The main page render should always work regardless of authentication status
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-md mx-auto">
          {loading ? (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-center mb-4">Chargement...</h2>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-directiveplus-600"></div>
              </div>
            </div>
          ) : (
            <>
              <DirectivesAccessForm />
              <LoginLink />
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
