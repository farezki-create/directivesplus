
import React from "react";
import AppNavigation from "@/components/AppNavigation";
import DirectivesContent from "./DirectivesContent";
import PatientHeader from "./PatientHeader";
import SecurityAlert from "./SecurityAlert";
import { useDossierStore } from "@/store/dossierStore";
import { extractPatientInfo } from "@/utils/patient/patientInfoExtractor";
import { DirectiveItem } from "@/types/directives";

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

  // Extraire les directives du dossier actif avec la nouvelle structure normalisée
  const getDirectivesFromDossier = (): DirectiveItem[] => {
    if (!dossierActif?.contenu?.directives) {
      return [];
    }
    
    const directives = dossierActif.contenu.directives;
    
    // Si c'est déjà au bon format (DirectiveItem[])
    if (Array.isArray(directives) && directives.length > 0 && directives[0].type) {
      return directives as DirectiveItem[];
    }
    
    // Sinon, essayer de normaliser l'ancien format
    const normalizedDirectives: DirectiveItem[] = [];
    
    if (Array.isArray(directives)) {
      directives.forEach((item: any, index: number) => {
        if (item.file_path) {
          // C'est un document
          normalizedDirectives.push({
            id: item.id || `doc-${index}`,
            type: 'document',
            file_path: item.file_path,
            file_name: item.file_name || `Document ${index + 1}`,
            content_type: item.content_type,
            file_size: item.file_size,
            description: item.description,
            created_at: item.created_at || new Date().toISOString()
          });
        } else if (item.content) {
          // C'est une directive textuelle
          normalizedDirectives.push({
            id: item.id || `directive-${index}`,
            type: 'directive',
            content: item.content,
            created_at: item.created_at || new Date().toISOString()
          });
        }
      });
    }
    
    return normalizedDirectives;
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
              <DirectivesContent directives={directives} />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default DossierView;
