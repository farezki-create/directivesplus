
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
  const { getDossierUtilisateurAuthentifie, verifierCode } = useVerifierCodeAcces();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const codeParam = searchParams.get("code");
  
  // Si l'utilisateur est déjà authentifié, charger ses directives
  useEffect(() => {
    const loadUserDirectives = async () => {
      if (!isAuthenticated || !user || loading) return;
      
      try {
        setLoading(true);
        console.log("MesDirectives - Loading directives for user:", user.id);
        
        // Si un code est fourni dans l'URL, essayer de le vérifier
        if (codeParam) {
          console.log("MesDirectives - Code provided in URL, verifying:", codeParam);
          
          const dossier = await verifierCode(codeParam, `${user.user_metadata?.first_name}_${user.user_metadata?.last_name}`);
          
          if (dossier) {
            console.log("MesDirectives - Code verified successfully:", dossier);
            setDossierActif(dossier);
            toast({
              title: "Accès autorisé",
              description: "Les directives partagées ont été chargées avec succès"
            });
            navigate("/directives-docs");
            return;
          } else {
            console.log("MesDirectives - Code verification failed");
            toast({
              title: "Erreur",
              description: "Le code d'accès est invalide ou expiré",
              variant: "destructive"
            });
            setError("Code d'accès invalide ou expiré");
            // Continue loading user's own directives
          }
        }
        
        // Essayer de récupérer le dossier de l'utilisateur
        const dossier = await getDossierUtilisateurAuthentifie(user.id, "directive");
        
        if (dossier) {
          console.log("MesDirectives - Dossier loaded successfully:", dossier);
          setDossierActif(dossier);
          toast({
            title: "Accès autorisé",
            description: "Vos directives ont été chargées avec succès"
          });
          navigate("/directives-docs"); // Rediriger vers la page des documents de directives
        } else {
          // Rediriger vers le tableau de bord même s'il n'y a pas de dossier
          console.log("MesDirectives - User authenticated but no dossier found");
          toast({
            title: "Information",
            description: "Aucune directive trouvée. Vous pouvez en créer ou en télécharger."
          });
          navigate("/directives-docs"); // Rediriger vers la page des documents de directives
        }
      } catch (error) {
        console.error("MesDirectives - Error loading directives:", error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors du chargement de vos directives",
          variant: "destructive"
        });
        setLoading(false);
        setError("Erreur lors du chargement des directives");
      } finally {
        setLoading(false);
      }
    };

    loadUserDirectives();
  }, [isAuthenticated, user, navigate, setDossierActif, getDossierUtilisateurAuthentifie, codeParam, verifierCode, loading]);

  // Le rendu principal de la page doit toujours fonctionner, quel que soit l'état d'authentification
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
              {error && (
                <div className="bg-red-50 border border-red-300 rounded-md p-4 mb-4">
                  <p className="text-red-700">{error}</p>
                </div>
              )}
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
