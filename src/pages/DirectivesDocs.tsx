
import { useDirectivesDocuments } from "@/hooks/useDirectivesDocuments";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
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
  const { dossierActif, setDossierActif } = useDossierStore();
  const navigate = useNavigate();
  const { verifierCode } = useVerifierCodeAcces();
  
  console.log("DirectivesDocs - Auth state:", { userId: user?.id, hasProfile: !!profile, isAuthenticated, isLoading: authLoading });
  console.log("DirectivesDocs - Dossier actif:", dossierActif);
  
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

  // Vérifier si nous avons déjà un accès public vérifié via le store
  useEffect(() => {
    if (!isAuthenticated && dossierActif && !publicAccessVerified) {
      console.log("Accès public déjà vérifié via le store dossier");
      setPublicAccessVerified(true);
    }
  }, [dossierActif, isAuthenticated, publicAccessVerified]);

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

  // Si l'utilisateur est authentifié, afficher directement ses documents
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen flex flex-col">
        <AppNavigation />
        
        <main className="flex-grow container mx-auto px-4 py-8">
          <DirectivesNavigation />
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Directives</h1>
            <p className="text-gray-600">
              Gérez vos directives anticipées et documents associés
            </p>
          </div>
          
          <DirectivesPageContent
            documents={documents}
            showAddOptions={showAddOptions}
            setShowAddOptions={setShowAddOptions}
            userId={user.id}
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
          showPrint={false}
        />
        
        <footer className="bg-white py-6 border-t mt-auto">
          <div className="container mx-auto px-4 text-center text-gray-500">
            <p>© 2025 DirectivesPlus. Tous droits réservés.</p>
          </div>
        </footer>
      </div>
    );
  }

  // Pour les utilisateurs non authentifiés avec accès public vérifié OU avec un dossier dans le store
  if (!isAuthenticated && (publicAccessVerified || dossierActif)) {
    return (
      <div className="min-h-screen flex flex-col">
        <AppNavigation />
        
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Directives Anticipées</h1>
            <p className="text-gray-600">
              Accès aux directives anticipées via code d'accès
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
            documents={documents}
            showAddOptions={false}
            setShowAddOptions={() => {}}
            userId=""
            onUploadComplete={() => {}}
            onDownload={handleDownload}
            onPrint={handlePrint}
            onView={handleView}
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
  }

  // Afficher le formulaire d'accès public si l'utilisateur n'est pas authentifié et n'a pas d'accès vérifié
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
};

export default DirectivesDocs;
