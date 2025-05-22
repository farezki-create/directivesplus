
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import SignatureCanvas from "./SignatureCanvas";
import QuestionnairesSection from "./QuestionnairesSection";
import ExamplesSection from "./ExamplesSection";
import TrustedPersonsSection from "./TrustedPersonsSection";
import ProfileSection from "./ProfileSection";
import FreeTextSection from "./FreeTextSection";
import ActionButtons from "./ActionButtons";
import { useSynthesisData } from "@/hooks/useSynthesisData";
import { useSynthesisActions } from "@/hooks/useSynthesisActions";

interface SynthesisContentProps {
  profileData: any;
  userId?: string;
}

const SynthesisContent = ({ profileData, userId }: SynthesisContentProps) => {
  const navigate = useNavigate();
  const signatureRef = useRef<HTMLDivElement>(null);
  
  // Utilisation de nos hooks
  const { 
    loading, 
    responses, 
    customPhrases, 
    examplePhrases, 
    trustedPersons, 
    freeText, 
    setFreeText 
  } = useSynthesisData(userId);
  
  const {
    saving,
    signature,
    setSignature,
    handleSaveAndGeneratePDF
  } = useSynthesisActions(userId);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
      </div>
    );
  }

  const onSave = async () => {
    await handleSaveAndGeneratePDF(
      freeText, 
      {
        profileData,
        responses,
        examplePhrases,
        customPhrases,
        trustedPersons
      }
    );
    // Remarque: La redirection est maintenant gérée dans le hook useSynthesisActions
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate("/rediger")}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Retour à la rédaction
        </Button>
      </div>
      
      <h1 className="text-3xl font-bold text-center mb-6">
        Synthèse des Directives Anticipées
      </h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div id="synthesis-document" className="space-y-8">
          {/* Informations du profil */}
          <ProfileSection profileData={profileData} />
          
          {/* Personnes de confiance */}
          <TrustedPersonsSection trustedPersons={trustedPersons} />
          
          {/* Réponses aux questionnaires */}
          <QuestionnairesSection responses={responses} />
          
          {/* Phrases d'exemples et phrases personnalisées */}
          <ExamplesSection 
            examplePhrases={examplePhrases} 
            customPhrases={customPhrases} 
          />
          
          {/* Section de texte libre */}
          <FreeTextSection 
            freeText={freeText}
            setFreeText={setFreeText}
          />
          
          {/* Section de signature */}
          <div className="space-y-4" ref={signatureRef}>
            <h3 className="text-lg font-medium">Signature</h3>
            <p className="text-sm text-gray-600">
              Je certifie que les informations ci-dessus reflètent mes volontés.
            </p>
            <div className="text-right text-sm text-gray-600">
              Date: {new Date().toLocaleDateString('fr-FR')}
            </div>
            <SignatureCanvas 
              initialSignature={signature} 
              onSave={(sig) => {
                setSignature(sig);
                toast({
                  title: "Signature enregistrée",
                  description: "Votre signature a été capturée avec succès"
                });
              }}
            />
          </div>
        </div>
      </div>
      
      <ActionButtons 
        onSave={onSave}
        saving={saving}
      />
    </div>
  );
};

export default SynthesisContent;
