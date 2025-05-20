
import { useAccessCode } from "@/hooks/access-codes/useAccessCode";
import { useDirectivesDocuments } from "@/hooks/useDirectivesDocuments";
import { useAuth } from "@/contexts/AuthContext";

import AppNavigation from "@/components/AppNavigation";
import DirectivesLoadingState from "@/components/documents/DirectivesLoadingState";
import DirectivesNavigation from "@/components/documents/DirectivesNavigation";
import DirectivesPageContent from "@/components/documents/DirectivesPageContent";
import DeleteConfirmationDialog from "@/components/documents/DeleteConfirmationDialog";
import DocumentPreviewDialog from "@/components/documents/DocumentPreviewDialog";
import AccessCodeDisplay from "@/components/documents/AccessCodeDisplay";
import { useEffect, useState } from "react";

const DirectivesDocs = () => {
  const { user, profile } = useAuth();
  const accessCode = useAccessCode(user, "directive");
  const [displayCode, setDisplayCode] = useState<string | null>(null);
  
  console.log("DirectivesDocs - Auth state:", { userId: user?.id, hasProfile: !!profile });
  console.log("DirectivesDocs - Access code:", accessCode);
  
  const {
    isLoading,
    isAuthenticated,
    documents,
    showAddOptions,
    setShowAddOptions,
    previewDocument,
    setPreviewDocument,
    documentToDelete,
    setDocumentToDelete,
    handleDownload,
    handlePrint,
    handleView,
    confirmDelete,
    handleDelete,
    handleUploadComplete,
    handlePreviewDownload,
    handlePreviewPrint
  } = useDirectivesDocuments();

  // Update displayCode whenever accessCode changes
  useEffect(() => {
    if (accessCode) {
      setDisplayCode(accessCode);
      console.log("DirectivesDocs - Setting displayCode:", accessCode);
    }
  }, [accessCode]);

  useEffect(() => {
    if (user && !accessCode) {
      console.log("No directive access code found, waiting for generation...");
    } else if (accessCode) {
      console.log("Directive access code found:", accessCode);
    }
  }, [user, accessCode]);

  if (isLoading) {
    return <DirectivesLoadingState />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppNavigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <DirectivesNavigation />
        
        {/* Affichage du code d'accès */}
        {displayCode && profile && (
          <div className="mt-4 mb-8">
            <AccessCodeDisplay 
              accessCode={displayCode}
              firstName={profile.first_name || ""}
              lastName={profile.last_name || ""}
              birthDate={profile.birth_date || ""}
              type="directive"
            />
          </div>
        )}
        
        {/* Pass display code rather than the direct access code */}
        <DirectivesPageContent
          documents={documents}
          showAddOptions={showAddOptions}
          setShowAddOptions={setShowAddOptions}
          userId={user?.id || ""}
          onUploadComplete={handleUploadComplete}
          onDownload={handleDownload}
          onPrint={handlePrint}
          onView={handleView}
          onDelete={confirmDelete}
          accessCode={displayCode}
          profile={profile}
        />
      </main>
      
      <DeleteConfirmationDialog
        documentId={documentToDelete}
        onOpenChange={() => setDocumentToDelete(null)}
        onConfirmDelete={handleDelete}
      />

      <DocumentPreviewDialog
        filePath={previewDocument}
        onOpenChange={() => setPreviewDocument(null)}
        onDownload={handlePreviewDownload}
        onPrint={handlePreviewPrint}
        showPrint={false} // Masquer le bouton imprimer dans la prévisualisation des directives
      />
      
      <footer className="bg-white py-6 border-t mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 DirectivesPlus. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default DirectivesDocs;
