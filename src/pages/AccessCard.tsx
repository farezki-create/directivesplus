
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AppNavigation from "@/components/AppNavigation";
import AccessCard from "@/components/card/AccessCard";
import LoadingState from "@/components/questionnaire/LoadingState";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User } from "lucide-react";
import { useAccessCode } from "@/hooks/access-codes/useAccessCode";
import { Card, CardContent } from "@/components/ui/card";
import AccessCodeDisplay from "@/components/documents/AccessCodeDisplay";

const AccessCardPage = () => {
  const { user, isAuthenticated, isLoading, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // Use the updated hook with isLoading state
  const { accessCode: directiveCode, isLoading: directiveLoading } = useAccessCode(user, "directive");
  const { accessCode: medicalCode, isLoading: medicalLoading } = useAccessCode(user, "medical");
  
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
    if (directiveCode || medicalCode) {
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

  // Show global loading state when initial auth is loading
  if (isLoading || loading) {
    return <LoadingState loading={true} />;
  }

  // Set default values for profile data if it's missing
  const firstName = profile?.first_name || "";
  const lastName = profile?.last_name || "";
  const birthDate = profile?.birth_date || null;

  // Check if we're still loading codes
  const isCodesLoading = directiveLoading || medicalLoading;

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
                isCodesLoading ? "Chargement de vos codes d'accès..." :
                "Préparez votre carte d'accès pour les professionnels de santé."}
            </p>
          </div>
          
          {/* Profile warning if incomplete */}
          {!profile || (!firstName && !lastName) ? (
            <Card className="mb-6 border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <User className="h-6 w-6 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-yellow-800">Profil incomplet</h3>
                    <p className="text-sm text-yellow-700">
                      Pour une meilleure expérience avec votre carte d'accès, veuillez compléter 
                      votre profil avec vos informations personnelles.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-3 border-yellow-300 bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      onClick={() => navigate("/profile")}
                    >
                      Compléter mon profil
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}
          
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
                      <p className="text-gray-400 italic">
                        {directiveLoading ? "En cours de génération..." : "Non disponible"}
                      </p>
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
                      <p className="text-gray-400 italic">
                        {medicalLoading ? "En cours de génération..." : "Non disponible"}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Affichage complet des codes avec les informations du profil */}
            {directiveCode && (
              <AccessCodeDisplay 
                accessCode={directiveCode}
                firstName={firstName}
                lastName={lastName}
                birthDate={birthDate || ""}
                type="directive"
              />
            )}
            
            {medicalCode && (
              <AccessCodeDisplay 
                accessCode={medicalCode}
                firstName={firstName}
                lastName={lastName}
                birthDate={birthDate || ""}
                type="medical"
              />
            )}
          </div>
          
          {/* Section pour la carte d'accès */}
          <div className="mb-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Votre carte d'accès personnelle</h2>
            <p className="text-gray-600 mb-6">
              Cette carte contient vos codes d'accès pour vos directives anticipées et données médicales. 
              Vous pouvez la télécharger ou l'imprimer pour l'avoir toujours avec vous.
            </p>
            
            {isCodesLoading ? (
              <div className="py-8 text-center">
                <LoadingState loading={true} message="Génération de votre carte d'accès..." />
              </div>
            ) : (
              <AccessCard 
                firstName={firstName} 
                lastName={lastName} 
                birthDate={birthDate}
                directiveCode={directiveCode}
                medicalCode={medicalCode}
              />
            )}
          </div>
          
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
