
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PDFGenerator } from "@/components/PDFGenerator";
import { supabase } from "@/integrations/supabase/client";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { usePDFData } from "@/components/pdf/usePDFData";
import { Button } from "@/components/ui/button";
import { FileText, Type } from "lucide-react";

export default function GeneratePDF() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const { responses } = useQuestionnairesResponses(userId || "");
  const { profile, trustedPersons } = usePDFData();
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
    if (!responses || !profile || !trustedPersons) return null;

    return (
      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <h3 className="text-xl font-semibold">Mes directives anticipées</h3>
        
        {/* Informations personnelles */}
        <div className="space-y-2">
          <h4 className="font-medium">Informations personnelles</h4>
          <p>Nom : {profile.last_name}</p>
          <p>Prénom : {profile.first_name}</p>
          <p>Date de naissance : {new Date(profile.birth_date).toLocaleDateString()}</p>
          <p>Adresse : {profile.address}</p>
          <p>{profile.postal_code} {profile.city}</p>
        </div>

        {/* Personnes de confiance */}
        {trustedPersons.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Personnes de confiance</h4>
            {trustedPersons.map((person, index) => (
              <div key={person.id} className="ml-4">
                <p>Personne {index + 1} :</p>
                <p>Nom : {person.name}</p>
                <p>Relation : {person.relation}</p>
                <p>Contact : {person.phone || person.email}</p>
              </div>
            ))}
          </div>
        )}

        {/* Réponses au questionnaire */}
        {responses.general && responses.general.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Mon avis d'une façon générale</h4>
            {responses.general.map((item, index) => (
              <div key={index} className="ml-4">
                <p className="font-medium">{item.question_text}</p>
                <p>{item.response}</p>
              </div>
            ))}
          </div>
        )}

        {responses.lifeSupport && responses.lifeSupport.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Maintien en vie</h4>
            {responses.lifeSupport.map((item, index) => (
              <div key={index} className="ml-4">
                <p className="font-medium">{item.question_text}</p>
                <p>{item.response}</p>
              </div>
            ))}
          </div>
        )}

        {responses.advancedIllness && responses.advancedIllness.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Maladie avancée</h4>
            {responses.advancedIllness.map((item, index) => (
              <div key={index} className="ml-4">
                <p className="font-medium">{item.question_text}</p>
                <p>{item.response}</p>
              </div>
            ))}
          </div>
        )}

        {responses.preferences && responses.preferences.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Mes goûts et mes peurs</h4>
            {responses.preferences.map((item, index) => (
              <div key={index} className="ml-4">
                <p className="font-medium">{item.question_text}</p>
                <p>{item.response}</p>
              </div>
            ))}
          </div>
        )}
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