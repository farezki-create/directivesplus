
import { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import SignatureCanvas from "./SignatureCanvas";
import QuestionnairesSection from "./QuestionnairesSection";
import ExamplesSection from "./ExamplesSection";
import TrustedPersonsSection from "./TrustedPersonsSection";
import ProfileSection from "./ProfileSection";
import FreeTextSection from "./FreeTextSection";
import MedicalDocumentSection from "./MedicalDocumentSection";
import MedicalDocumentsPreview from "./MedicalDocumentsPreview";
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
  const [medicalDocuments, setMedicalDocuments] = useState<any[]>([]);
  const [previewDocument, setPreviewDocument] = useState<string | null>(null);
  
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
        medicalDocuments
      }
    );
  };

  const handleMedicalDocumentUpload = () => {
    toast({
      title: "Document médical ajouté",
      description: "Le document médical sera intégré dans votre PDF de directives anticipées"
    });
  };

  const handleDocumentAdd = (documentInfo: any) => {
    setMedicalDocuments(prev => [...prev, documentInfo]);
  };

  const handleDocumentRemove = (documentId: string) => {
    setMedicalDocuments(prev => prev.filter(doc => doc.id !== documentId));
  };

  const handlePreviewDocument = (document: any) => {
    if (document.file_path) {
      setPreviewDocument(document.file_path);
    }
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
          
          <MedicalDocumentsPreview 
            documents={medicalDocuments}
            onPreview={handlePreviewDocument}
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
      
      <MedicalDocumentSection 
        userId={userId}
        onUploadComplete={handleMedicalDocumentUpload}
        onDocumentAdd={handleDocumentAdd}
        onDocumentRemove={handleDocumentRemove}
      />
      
      <ActionButtons 
        onSave={onSave}
        saving={saving}
      />

      {/* Gestion de l'aperçu des documents */}
      {previewDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setPreviewDocument(null)}>
          <div className="bg-white p-4 rounded-lg max-w-4xl max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Aperçu du document</h3>
              <button 
                onClick={() => setPreviewDocument(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            {previewDocument.startsWith('data:image/') ? (
              <img src={previewDocument} alt="Document médical" className="max-w-full h-auto" />
            ) : previewDocument.startsWith('data:application/pdf') ? (
              <iframe src={previewDocument} className="w-full h-96" />
            ) : (
              <p>Aperçu non disponible pour ce type de fichier</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SynthesisContent;
