
import React from "react";
import AppNavigation from "@/components/AppNavigation";
import DirectivesPageContent from "@/components/documents/DirectivesPageContent";
import DocumentPreviewDialog from "@/components/documents/DocumentPreviewDialog";

interface PublicDirectivesViewProps {
  dossierActif: any;
  profile: any;
  documents: any[];
  onDownload: (filePath: string, fileName: string) => void;
  onPrint: (filePath: string, contentType?: string) => void;
  onView: (filePath: string, contentType?: string) => void;
  previewDocument: string | null;
  setPreviewDocument: (path: string | null) => void;
  handlePreviewDownload: (filePath: string) => void;
  handlePreviewPrint: (filePath: string) => void;
  showAddOptions: boolean;
  setShowAddOptions: (show: boolean) => void;
  onUploadComplete: () => void;
}

const PublicDirectivesView: React.FC<PublicDirectivesViewProps> = ({
  dossierActif,
  profile,
  documents,
  onDownload,
  onPrint,
  onView,
  previewDocument,
  setPreviewDocument,
  handlePreviewDownload,
  handlePreviewPrint,
  showAddOptions,
  setShowAddOptions,
  onUploadComplete
}) => {
  // Extraire les documents du dossier actif s'ils existent
  const dossierDocuments = dossierActif?.contenu?.documents || [];
  
  // Combiner les documents du dossier avec les documents utilisateur (si authentifié)
  const allDocuments = [...dossierDocuments, ...documents];

  console.log("PublicDirectivesView - Documents du dossier:", dossierDocuments);
  console.log("PublicDirectivesView - Documents utilisateur:", documents);
  console.log("PublicDirectivesView - Tous les documents:", allDocuments);

  return (
    <div className="min-h-screen flex flex-col">
      <AppNavigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Directives Anticipées</h1>
          <p className="text-gray-600">
            {dossierActif ? "Documents ajoutés à vos directives" : "Accès aux directives anticipées via code d'accès"}
          </p>
          {dossierActif && dossierActif.profileData && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Patient:</strong> {dossierActif.profileData.first_name} {dossierActif.profileData.last_name}
              </p>
              {dossierActif.profileData.birth_date && (
                <p className="text-sm text-blue-800">
                  <strong>Date de naissance:</strong> {new Date(dossierActif.profileData.birth_date).toLocaleDateString('fr-FR')}
                </p>
              )}
            </div>
          )}
        </div>
        
        <DirectivesPageContent
          documents={allDocuments}
          showAddOptions={showAddOptions}
          setShowAddOptions={setShowAddOptions}
          userId={dossierActif?.userId || ""}
          onUploadComplete={onUploadComplete}
          onDownload={onDownload}
          onPrint={onPrint}
          onView={onView}
          onDelete={() => {}}
          profile={profile}
        />
      </main>
      
      <DocumentPreviewDialog
        filePath={previewDocument}
        onOpenChange={() => setPreviewDocument(null)}
        onDownload={handlePreviewDownload}
        onPrint={handlePreviewPrint}
        showPrint={false}
      />
      
      <footer className="bg-white py-6 border-t mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 DirectivesPlus. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicDirectivesView;
