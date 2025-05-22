
import { useDirectivesDocuments } from "@/hooks/useDirectivesDocuments";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useVerifierCodeAcces } from "@/hooks/useVerifierCodeAcces";
import { validateAccessCode, validateDossierResponse } from "@/utils/api/accessCodeValidation";
import { useDossierStore } from "@/store/dossierStore";
import { useNavigate } from "react-router-dom";

import AppNavigation from "@/components/AppNavigation";
import DirectivesLoadingState from "@/components/documents/DirectivesLoadingState";
import DirectivesNavigation from "@/components/documents/DirectivesNavigation";
import DirectivesPageContent from "@/components/documents/DirectivesPageContent";
import DeleteConfirmationDialog from "@/components/documents/DeleteConfirmationDialog";
import DocumentPreviewDialog from "@/components/documents/DocumentPreviewDialog";
import PublicDirectivesAccessForm from "@/components/access/PublicDirectivesAccessForm";
import { toast } from "@/hooks/use-toast";

const DirectivesDocs = () => {
  const { user, profile, isAuthenticated, isLoading: authLoading } = useAuth();
  const [publicAccessVerified, setPublicAccessVerified] = useState(false);
  const [publicAccessLoading, setPublicAccessLoading] = useState(false);
  const { setDossierActif } = useDossierStore();
  const navigate = useNavigate();
  const { verifierCode } = useVerifierCodeAcces();
  
  console.log("DirectivesDocs - Auth state:", { userId: user?.id, hasProfile: !!profile, isAuthenticated });
  
  const {
    isLoading: documentsLoading,
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

  const isLoading = authLoading || documentsLoading;

  const handlePublicAccess = async (formData) => {
    if (!validateAccessCode(formData.accessCode)) return;
    
    setPublicAccessLoading(true);
    try {
      console.log("Vérification de l'accès public:", formData);
      
      // Vérifier le code d'accès
      const result = await verifierCode(formData.accessCode, 
        `directives_public_${formData.firstName}_${formData.lastName}`);
      
      if (!validateDossierResponse({ success: !!result, dossier: result, error: !result ? "Code invalide" : null })) {
        setPublicAccessLoading(false);
        return;
      }
      
      // Stocker le dossier dans le store
      setDossierActif(result);
      setPublicAccessVerified(true);
      
      // Afficher une notification de succès
      toast({
        title: "Accès autorisé",
        description: "Vous avez accès aux directives anticipées",
      });
    } catch (error) {
      console.error("Erreur lors de la vérification de l'accès public:", error);
      toast({
        title: "Erreur d'accès",
        description: "Impossible de vérifier votre accès aux directives",
        variant: "destructive"
      });
    } finally {
      setPublicAccessLoading(false);
    }
  };

  // Si l'utilisateur est en train de se connecter, afficher un état de chargement
  if (isLoading) {
    return <DirectivesLoadingState />;
  }

  // Afficher le formulaire d'accès public si l'utilisateur n'est pas authentifié et n'a pas encore vérifié son accès
  if (!isAuthenticated && !publicAccessVerified) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppNavigation />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-center mb-6">
              Accès aux directives anticipées
            </h1>
            
            <PublicDirectivesAccessForm 
              onSubmit={handlePublicAccess} 
              loading={publicAccessLoading} 
            />

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Si vous avez un compte, vous pouvez également{" "}
                <a href="/auth" className="text-directiveplus-600 hover:underline">
                  vous connecter
                </a>
                {" "}pour accéder à vos directives.
              </p>
            </div>
          </div>
        </main>
        
        <footer className="bg-white py-6 border-t mt-auto">
          <div className="container mx-auto px-4 text-center text-gray-500">
            <p>© 2025 DirectivesPlus. Tous droits réservés.</p>
          </div>
        </footer>
      </div>
    );
  }

  // Rediriger vers la page d'affichage si l'utilisateur a vérifié son accès public
  if (publicAccessVerified) {
    navigate("/affichage-dossier");
    return <DirectivesLoadingState />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppNavigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <DirectivesNavigation />
        
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
