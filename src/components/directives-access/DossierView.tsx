
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

  // Extraire les directives du dossier actif
  const getDirectivesFromDossier = () => {
    if (!dossierActif?.contenu) return null;
    
    // Vérifier s'il y a des directives dans le contenu
    if (dossierActif.contenu.directives && Array.isArray(dossierActif.contenu.directives)) {
      return dossierActif.contenu.directives;
    }
    
    // Vérifier s'il y a des documents
    if (dossierActif.contenu.documents && Array.isArray(dossierActif.contenu.documents)) {
      return dossierActif.contenu.documents;
    }
    
    return null;
  };

  const directives = getDirectivesFromDossier();
  
  console.log("=== DEBUG DossierView ===");
  console.log("DossierView - showDocuments:", showDocuments);
  console.log("DossierView - dossierActif:", dossierActif);
  console.log("DossierView - directives extraites:", directives);
  console.log("DossierView - isCodeAccess:", isCodeAccess);

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
                {directives && directives.length > 0 ? (
                  <DirectivesContent
                    directives={directives}
                  />
                ) : (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
                    <h3 className="text-lg font-medium text-amber-800 mb-2">
                      Aucune directive disponible
                    </h3>
                    <p className="text-amber-700">
                      Ce patient n'a pas encore enregistré de directives anticipées 
                      ou elles ne sont pas disponibles via ce mode d'accès.
                    </p>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default DossierView;
