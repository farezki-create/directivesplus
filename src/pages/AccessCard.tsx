
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AppNavigation from "@/components/AppNavigation";
import AccessCard from "@/components/card/AccessCard";
import LoadingState from "@/components/questionnaire/LoadingState";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAccessCode } from "@/hooks/access-codes/useAccessCode";
import { Card, CardContent } from "@/components/ui/card";
import AccessCodeDisplay from "@/components/documents/AccessCodeDisplay";

const AccessCardPage = () => {
  const { user, isAuthenticated, isLoading, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // Directly use the hooks to get access codes
  const directiveCode = useAccessCode(user, "directive");
  const medicalCode = useAccessCode(user, "medical");
  
  // Determine if codes are ready
  const [codesReady, setCodesReady] = useState(false);
  
  // Debug logs
  useEffect(() => {
    console.log("AccessCardPage - Auth state:", { 
      userId: user?.id, 
      hasProfile: !!profile, 
      directiveCode, 
      medicalCode 
    });
  }, [user, profile, directiveCode, medicalCode]);
  
  useEffect(() => {
    if (directiveCode && medicalCode) {
      console.log("AccessCardPage - Codes ready:", { directiveCode, medicalCode });
      setCodesReady(true);
    }
  }, [directiveCode, medicalCode]);
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Accès refusé",
        description: "Vous devez être connecté pour accéder à cette page",
        variant: "destructive"
      });
      navigate("/auth", { state: { from: "/carte-acces" } });
    } else if (isAuthenticated) {
      setLoading(false);
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading || loading) {
    return <LoadingState loading={true} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AppNavigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Retour au tableau de bord
            </Button>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Carte d'accès</h1>
            <p className="text-gray-600 mt-2">
              {codesReady ? 
                "Votre carte d'accès est prête à être utilisée." : 
                "Chargement de vos codes d'accès..."}
            </p>
          </div>
          
          {/* Section dédiée à l'affichage des codes d'accès */}
          <div className="mb-8">
            <Card className="mb-6 border-purple-200">
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4">Vos codes d'accès</h2>
                <div className="space-y-4">
                  {directiveCode ? (
                    <div className="p-3 bg-purple-50 rounded-md border border-purple-200">
                      <p className="text-sm font-medium text-gray-500 mb-1">Code d'accès directives anticipées</p>
                      <p className="font-mono text-lg font-bold tracking-wider">{directiveCode}</p>
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                      <p className="text-sm font-medium text-gray-500 mb-1">Code d'accès directives anticipées</p>
                      <p className="text-gray-400 italic">En cours de génération...</p>
                    </div>
                  )}
                  
                  {medicalCode ? (
                    <div className="p-3 bg-sky-50 rounded-md border border-sky-200">
                      <p className="text-sm font-medium text-gray-500 mb-1">Code d'accès données médicales</p>
                      <p className="font-mono text-lg font-bold tracking-wider">{medicalCode}</p>
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                      <p className="text-sm font-medium text-gray-500 mb-1">Code d'accès données médicales</p>
                      <p className="text-gray-400 italic">En cours de génération...</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Affichage complet des codes avec les informations du profil */}
            {profile && directiveCode && (
              <AccessCodeDisplay 
                accessCode={directiveCode}
                firstName={profile.first_name || ""}
                lastName={profile.last_name || ""}
                birthDate={profile.birth_date || ""}
                type="directive"
              />
            )}
            
            {profile && medicalCode && (
              <AccessCodeDisplay 
                accessCode={medicalCode}
                firstName={profile.first_name || ""}
                lastName={profile.last_name || ""}
                birthDate={profile.birth_date || ""}
                type="medical"
              />
            )}
          </div>
          
          {profile && (
            <AccessCard 
              firstName={profile.first_name || ""} 
              lastName={profile.last_name || ""} 
              birthDate={profile.birth_date}
            />
          )}
          
          <div className="mt-10 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-800">Pourquoi utiliser une carte d'accès?</h3>
            <ul className="list-disc list-inside mt-2 text-blue-700 space-y-1 text-sm">
              <li>Pratique pour communiquer rapidement vos codes d'accès aux professionnels de santé</li>
              <li>Format carte bancaire, facile à conserver dans votre portefeuille</li>
              <li>Solution d'urgence pour accéder à vos directives anticipées et données médicales</li>
              <li>Personnalisable selon vos besoins (directives, données médicales ou les deux)</li>
            </ul>
          </div>
        </div>
      </main>
      
      <footer className="bg-white py-6 border-t mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 DirectivesPlus. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default AccessCardPage;
