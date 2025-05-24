
import React from "react";
import AppNavigation from "@/components/AppNavigation";
import DirectivesContent from "./DirectivesContent";
import PatientHeader from "./PatientHeader";
import SecurityAlert from "./SecurityAlert";
import { useDossierStore } from "@/store/dossierStore";
import { extractPatientInfo } from "@/utils/patient/patientInfoExtractor";

interface DossierViewProps {
  isAuthenticated: boolean;
  user: any;
  showDocuments: boolean;
  documents: any[];
  onUploadComplete: () => void;
  onDownload: (doc: any) => void;
  onPrint: (doc: any) => void;
  onView: (doc: any) => void;
  onDelete: (doc: any) => void;
  onShowDocuments: () => void;
}

const DossierView: React.FC<DossierViewProps> = ({
  isAuthenticated,
  user,
  showDocuments,
  documents,
  onUploadComplete,
  onDownload,
  onPrint,
  onView,
  onDelete,
  onShowDocuments
}) => {
  const { dossierActif } = useDossierStore();
  
  // Déterminer si on est en accès par code (pas d'utilisateur authentifié mais dossier actif)
  const isCodeAccess = dossierActif && !isAuthenticated;

  const handleReturnHome = () => {
    window.location.href = "/";
  };

  console.log("DossierView - showDocuments:", showDocuments, "documents:", documents);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavigation hideEditingFeatures={isCodeAccess} />
      
      <main className="container mx-auto px-4 py-8">
        {dossierActif && (
          <>
            <PatientHeader 
              patientInfo={extractPatientInfo(dossierActif.contenu?.patient)}
              onReturnHome={handleReturnHome}
            />
            
            <SecurityAlert />
            
            {!showDocuments ? (
              <div className="text-center py-8">
                <button
                  onClick={onShowDocuments}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                >
                  Voir les directives
                </button>
              </div>
            ) : (
              <DirectivesContent
                directives={documents}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default DossierView;
