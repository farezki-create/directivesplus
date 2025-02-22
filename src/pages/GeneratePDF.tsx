
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PDFGenerator } from "@/components/PDFGenerator";
import { supabase } from "@/integrations/supabase/client";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { usePDFData } from "@/components/pdf/usePDFData";
import { Button } from "@/components/ui/button";
import { FileText, Type, UserCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ResponseSection } from "@/components/responses/ResponseSection";
import { Card } from "@/components/ui/card";

export default function GeneratePDF() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const { responses, isLoading: responsesLoading } = useQuestionnairesResponses(userId || "");
  const { profile, trustedPersons, loading: profileLoading } = usePDFData();
  const [showTextVersion, setShowTextVersion] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/auth");
        return;
      }
      setUserId(session.user.id);
    };
    checkAuth();
  }, [navigate]);

  const renderTextVersion = () => {
    if (responsesLoading || profileLoading) {
      return (
        <div className="flex items-center justify-center p-8">
          <p className="text-gray-500">Chargement de vos directives...</p>
        </div>
      );
    }

    if (!profile) {
      return (
        <Card className="p-6 space-y-4">
          <div className="flex flex-col items-center text-center space-y-4">
            <UserCircle className="h-12 w-12 text-gray-400" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Profil non trouvé</h3>
              <p className="text-gray-500 mt-1">
                Pour générer vos directives anticipées, veuillez d'abord créer votre profil.
              </p>
            </div>
            <Button
              onClick={() => navigate("/dashboard")}
              className="mt-4"
            >
              Créer mon profil
            </Button>
          </div>
        </Card>
      );
    }

    return (
      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <h3 className="text-xl font-semibold">Mes directives anticipées</h3>
        
        {/* Informations personnelles */}
        <div className="space-y-2">
          <h4 className="font-medium">Informations personnelles</h4>
          <p>Nom : {profile.last_name || 'Non renseigné'}</p>
          <p>Prénom : {profile.first_name || 'Non renseigné'}</p>
          <p>Date de naissance : {profile.birth_date ? new Date(profile.birth_date).toLocaleDateString() : 'Non renseignée'}</p>
          <p>Adresse : {profile.address || 'Non renseignée'}</p>
          <p>{profile.postal_code || ''} {profile.city || ''}</p>
        </div>

        {/* Personnes de confiance (optionnel) */}
        {trustedPersons && trustedPersons.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Personnes de confiance</h4>
            {trustedPersons.map((person, index) => (
              <div key={person.id} className="ml-4 p-2 bg-gray-50 rounded">
                <p>Personne {index + 1} :</p>
                <p>Nom : {person.name}</p>
                <p>Relation : {person.relation || 'Non renseignée'}</p>
                <p>Contact : {person.phone || person.email || 'Non renseigné'}</p>
              </div>
            ))}
          </div>
        )}

        {/* Réponses au questionnaire */}
        <ResponseSection title="Mon avis d'une façon générale" responses={responses?.general || []} />
        <ResponseSection title="Maintien en vie" responses={responses?.lifeSupport || []} />
        <ResponseSection title="Maladie avancée" responses={responses?.advancedIllness || []} />
        <ResponseSection title="Mes goûts et mes peurs" responses={responses?.preferences || []} />
      </div>
    );
  };

  if (!userId) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Génération de mes directives anticipées</h2>
          <button 
            onClick={() => navigate("/free-text")}
            className="text-blue-500 hover:text-blue-700"
          >
            Retour à la saisie
          </button>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={() => setShowTextVersion(!showTextVersion)}
            variant={showTextVersion ? "secondary" : "outline"}
            className="flex items-center gap-2"
          >
            <Type className="h-4 w-4" />
            Version texte
          </Button>
          <PDFGenerator userId={userId} />
          <PDFGenerator userId={userId} isCardFormat={true} />
        </div>

        {showTextVersion && renderTextVersion()}
      </div>
    </div>
  );
}
