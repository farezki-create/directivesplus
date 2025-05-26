
import { useRef } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import SignatureCanvas from "./SignatureCanvas";
import QuestionnairesSection from "./QuestionnairesSection";
import ExamplesSection from "./ExamplesSection";
import TrustedPersonsSection from "./TrustedPersonsSection";
import ProfileSection from "./ProfileSection";
import FreeTextSection from "./FreeTextSection";
import ActionButtons from "./ActionButtons";
import { DocumentHeader } from "./DocumentHeader";
import { useSynthesisData } from "@/hooks/useSynthesisData";
import { useSynthesisActions } from "@/hooks/useSynthesisActions";

interface SynthesisContentProps {
  profileData: any;
  userId?: string;
}

const SynthesisContent = ({ profileData, userId }: SynthesisContentProps) => {
  const signatureRef = useRef<HTMLDivElement>(null);
  
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
        trustedPersons,
        medicalDocuments: [] // Pas de documents médicaux
      }
    );
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <DocumentHeader />
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div id="synthesis-document" className="space-y-8">
          <ProfileSection profileData={profileData} />
          <TrustedPersonsSection trustedPersons={trustedPersons} />
          <QuestionnairesSection responses={responses} />
          <ExamplesSection 
            examplePhrases={examplePhrases} 
            customPhrases={customPhrases} 
          />
          <FreeTextSection 
            freeText={freeText}
            setFreeText={setFreeText}
          />
          
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
