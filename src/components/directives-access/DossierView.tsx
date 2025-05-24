
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

  console.log("=== DEBUG DossierView ===");
  console.log("DossierView - showDocuments:", showDocuments);
  console.log("DossierView - documents reçus:", documents);
  console.log("DossierView - Type des documents:", typeof documents);
  console.log("DossierView - Est un tableau documents:", Array.isArray(documents));
  console.log("DossierView - Longueur documents:", documents?.length);
  console.log("DossierView - dossierActif:", dossierActif);
  console.log("DossierView - dossierActif.contenu?.documents:", dossierActif?.contenu?.documents);
  
  // Analyse plus poussée des documents reçus
  if (documents) {
    console.log("DossierView - Premier document:", documents[0]);
    documents.forEach((doc, index) => {
      console.log(`DossierView - Document ${index}:`, doc);
    });
  }

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
              <>
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h3 className="font-semibold text-yellow-800">Debug Info - DossierView</h3>
                  <p><strong>Documents type:</strong> {typeof documents}</p>
                  <p><strong>Is array:</strong> {Array.isArray(documents) ? 'Oui' : 'Non'}</p>
                  <p><strong>Length:</strong> {documents?.length || 'undefined'}</p>
                  <details className="mt-2">
                    <summary className="cursor-pointer text-yellow-700">Voir documents détaillés</summary>
                    <pre className="mt-2 p-2 bg-yellow-100 rounded text-xs overflow-auto">
                      {JSON.stringify(documents, null, 2)}
                    </pre>
                  </details>
                </div>
                
                <DirectivesContent
                  directives={documents}
                />
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default DossierView;
